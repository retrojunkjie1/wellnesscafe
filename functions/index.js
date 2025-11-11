/*
  AI endpoint using Google Generative AI (Gemini) via Firebase Functions.
  Configure secret: GENAI_API_KEY (firebase functions:secrets:set GENAI_API_KEY)
*/

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
const newsProxyApp = require("./newsProxy");

// Lazy-load SDK to reduce cold start cost
let GoogleGenerativeAI;

exports.aiAsk = functions.https.onRequest(async (req, res) => {
  // CORS + preflight
  cors(req, res, async () => {
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { message, state, category } = req.body || {};
      const { snippets } = req.body || {};
      if (
        !message ||
        typeof message !== "string" ||
        message.trim().length < 2
      ) {
        return res
          .status(400)
          .json({ error: "Provide a user 'message' string" });
      }

      const apiKey =
        process.env.GENAI_API_KEY ||
        process.env.GOOGLE_GENAI_API_KEY ||
        functions.config()?.genai?.key;
      if (!apiKey) {
        return res.status(500).json({
          error:
            "Missing GENAI_API_KEY. Set with 'firebase functions:secrets:set GENAI_API_KEY'",
        });
      }

      if (!GoogleGenerativeAI) {
        ({ GoogleGenerativeAI } = require("@google/generative-ai"));
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const system = `You are WellnessCafe AI, a calm, precise assistant for recovery resources. \n- Prefer concise, actionable answers. \n- If asked about sober living in a specific state, include referral steps and safety notes. \n- If the user requests providers, list general steps and direct them to our directory pages.`;

      const contextBits = [];
      if (state) {
        contextBits.push(`State: ${state}`);
      }
      if (category) {
        contextBits.push(`Category: ${category}`);
      }
      if (Array.isArray(snippets) && snippets.length) {
        const items = snippets
          .slice(0, 5)
          .map(
            (s, i) =>
              `- ${s.name || "(name)"} — ${s.city || "(city)"} — ${
                s.type || "(type)"
              }`
          )
          .join("\n");
        contextBits.push(`Local listings (top):\n${items}`);
      }

      // Server-side grounding: fetch and rank top homes from Firestore for this state
      const addDbSnippets = async () => {
        try {
          if (!state) {
            return;
          }
          if (!admin.apps?.length) {
            admin.initializeApp();
          }
          const db = admin.firestore();
          const snap = await db
            .collection(`soberHomes/${state}/homes`)
            .limit(200)
            .get();
          if (snap.empty) {
            return;
          }
          const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          const msg = (message || "").toLowerCase();
          const tokens = msg
            .split(/[^a-z0-9]+/i)
            .filter((t) => t && t.length > 2);
          const scoreOf = (h) => {
            const hay = [
              h.name,
              h.city,
              h.type,
              Array.isArray(h.categories) ? h.categories.join(" ") : "",
            ]
              .join(" ")
              .toLowerCase();
            let s = 0;
            for (const t of tokens) {
              if (hay.includes(t)) s += 1;
            }
            // small bonus for state matches implicit via presence
            if (h.county) {
              s += 0.2;
            }
            return s;
          };
          const ranked = docs
            .map((h) => ({ h, s: scoreOf(h) }))
            .sort((a, b) => b.s - a.s);
          const top = ranked
            .slice(0, 5)
            .filter((r) => r.s > 0)
            .map(({ h }) => h);
          if (top.length) {
            const lines = top
              .map(
                (s) =>
                  `- ${s.name || "(name)"} — ${s.city || "(city)"} — ${
                    s.type || "(type)"
                  }`
              )
              .join("\n");
            contextBits.push(`From database (matches):\n${lines}`);
          }
        } catch (e) {
          console.error("db grounding error", e);
        }
      };

      await addDbSnippets();
      const context = contextBits.length
        ? `\nContext: ${contextBits.join(" | ")}`
        : "";

      const fullPrompt = `${system}\n${context}\n\nUser: ${message}\nAssistant:`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      });
      const text =
        typeof result?.response?.text === "function"
          ? result.response.text()
          : "";
      return res.status(200).json({ text: text || "(no response)" });
    } catch (err) {
      console.error("aiAsk error:", err);
      return res.status(500).json({ error: "AI request failed" });
    }
  });
});

/**
 * Image proxy to ensure remote thumbnails load reliably and are cacheable under our domain.
 * Usage: /imgProxy?u=<encoded URL>
 */
exports.imgProxy = functions.https.onRequest(async (req, res) => {
  const url = String(req.query.u || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).send("Bad url");
  }
  try {
    const upstream = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "WellnessCafeBot/1.0" },
    });
    if (!upstream.ok) {
      return res.status(502).send("Upstream error");
    }
    const type = upstream.headers.get("content-type") || "image/jpeg";
    res.set("content-type", type);
    res.set("cache-control", "public, max-age=3600, s-maxage=86400");
    const buf = Buffer.from(await upstream.arrayBuffer());
    return res.status(200).send(buf);
  } catch (e) {
    console.error("imgProxy error", e);
    return res.status(500).send("Proxy failed");
  }
});

/**
 * Article reader: fetches external article and extracts readable content server-side.
 * Returns JSON { title, byline, content, siteName, url, image }.
 * Usage: /articleRead?u=<encoded URL>
 */
exports.articleRead = functions.https.onRequest(async (req, res) => {
  const url = String(req.query.u || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "Bad url" });
  }
  try {
    const [{ JSDOM }, { Readability }, sanitizeHtml] = await Promise.all([
      import("jsdom"),
      import("@mozilla/readability"),
      import("sanitize-html").then((m) => m.default || m),
    ]);
    // Use a realistic browser-like headers set to improve compatibility
    const headers = {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      referer: "https://news.google.com/",
    };

    const resp = await fetch(url, {
      redirect: "follow",
      headers,
    });
    if (!resp.ok) {
      return res.status(502).json({ error: "Fetch failed" });
    }
    const finalUrl = resp.url || url;
    const html = await resp.text();
    const dom = new JSDOM(html, { url: finalUrl });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article) {
      return res.status(200).json({ title: "", content: "", url: finalUrl });
    }
    const cleaned = sanitizeHtml(article.content || "", {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "figure",
        "figcaption",
      ]),
      allowedAttributes: {
        a: ["href", "name", "target", "rel"],
        img: ["src", "alt", "title"],
        "*": ["class"],
      },
      transformTags: {
        a: (tagName, attribs) => ({
          tagName: "a",
          attribs: {
            ...attribs,
            target: "_blank",
            rel: "noopener noreferrer",
          },
        }),
      },
    });
    // Derive a site name fallback from the hostname if missing
    let siteName = article.siteName || "";
    try {
      if (!siteName && finalUrl) {
        const u = new URL(finalUrl);
        siteName = u.hostname.replace(/^www\./, "");
      }
    } catch {}
    return res.status(200).json({
      title: article.title || "",
      byline: article.byline || "",
      siteName,
      image: article.image || "",
      url: finalUrl,
      content: cleaned,
    });
  } catch (e) {
    console.error("articleRead error", e);
    return res.status(500).json({ error: "Reader failed" });
  }
});

/**
 * Scheduled sync: fetch external provider directories (SAMHSA, OpenReferral, State)
 * and upsert into Firestore. Runs weekly early Monday.
 * Configure relevant API keys as needed via functions:secrets
 */
exports.syncAssistants = functions.pubsub
  .schedule("every monday 03:00")
  .timeZone("America/New_York")
  .onRun(async () => {
    try {
      if (!admin.apps?.length) {
        admin.initializeApp();
      }
      const db = admin.firestore();
      const cfg = functions.config() || {};
      const sources = cfg.sources || {};

      // Helper: batched upserts to reduce write costs
      const upsertBatch = async (collectionPath, docs) => {
        if (!docs || !docs.length) return 0;
        let count = 0;
        const CHUNK = 400;
        for (let i = 0; i < docs.length; i += CHUNK) {
          const chunk = docs.slice(i, i + CHUNK);
          const batch = db.batch();
          for (const d of chunk) {
            const baseId = (d.name || d.id || `${Date.now()}-${Math.random()}`)
              .toString()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
            const ref = db.collection(collectionPath).doc(baseId);
            batch.set(ref, d, { merge: true });
          }
          await batch.commit();
          count += chunk.length;
        }
        return count;
      };

      // Normalization mirroring src/schemas/assistantSchema.js (simplified in CF)
      const sanitize = (input) => {
        const toStr = (v) => (typeof v === "string" ? v.trim() : "");
        const toArr = (v) =>
          Array.isArray(v)
            ? v
                .map(String)
                .map((s) => s.trim())
                .filter(Boolean)
            : typeof v === "string"
            ? v
                .split(/[|/,;]+/)
                .map((s) => s.trim())
                .filter(Boolean)
            : [];
        const out = {
          type: ["housing", "legal", "funding", "sobriety"].includes(
            input?.type
          )
            ? input.type
            : "sobriety",
          name: toStr(input?.name),
          source: toStr(input?.source || "external"),
          verified: Boolean(input?.verified),
          contact: {
            phone: toStr(input?.contact?.phone || input?.phone),
            email: toStr(input?.contact?.email || input?.email),
            url: toStr(input?.contact?.url || input?.website || input?.url),
          },
          applyOnline: Boolean(
            input?.applyOnline ||
              input?.has_application ||
              input?.application_url
          ),
          applicationUrl: toStr(
            input?.applicationUrl || input?.application_url
          ),
          description: toStr(input?.description || input?.summary),
          address: {
            street: toStr(input?.address?.street || input?.street),
            city: toStr(input?.address?.city || input?.city),
            state: toStr(
              input?.address?.state || input?.state || input?.state_code
            ),
            zip: toStr(input?.address?.zip || input?.zip || input?.postal_code),
          },
          insurance: toArr(input?.insurance || input?.insurance_types),
          gender: toArr(input?.gender || input?.genders_served),
          cost: toStr(input?.cost || input?.fee || input?.payment_options),
          tags: toArr(input?.tags || input?.categories),
        };
        out.city = out.address.city;
        out.state = out.address.state;
        return out;
      };

      // Fetch helpers
      const fetchJson = async (url, { timeoutMs = 20000 } = {}) => {
        if (!url) return null;
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), timeoutMs);
        try {
          const res = await fetch(url, {
            signal: ctrl.signal,
            headers: { accept: "application/json" },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return await res.json();
        } finally {
          clearTimeout(t);
        }
      };

      // Config-driven fetchers (supply JSON URLs via: firebase functions:config:set sources.samhsa_url=...)
      const fetchSamhsa = async () => {
        const url = sources.samhsa_url; // expects JSON array
        const data = await fetchJson(url);
        if (!Array.isArray(data)) return [];
        return data.map((r) => ({ ...r, source: "SAMHSA" }));
      };
      const fetchOpenReferral = async () => {
        const url = sources.openref_url; // expects HSDS-like JSON array
        const data = await fetchJson(url);
        if (!Array.isArray(data)) return [];
        return data.map((r) => ({ ...r, source: "OpenReferral" }));
      };
      const fetchStateFeeds = async () => {
        const urls = String(sources.state_urls || "")
          .split(/[\s,]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (!urls.length) return [];
        const lists = await Promise.all(
          urls.map(async (u) => {
            const arr = await fetchJson(u);
            return Array.isArray(arr) ? arr : [];
          })
        );
        return lists.flat().map((r) => ({ ...r, source: "State" }));
      };

      const [samhsa, openref, states] = await Promise.all([
        fetchSamhsa(),
        fetchOpenReferral(),
        fetchStateFeeds(),
      ]);

      const allRaw = [...samhsa, ...openref, ...states];
      // De-dup by name+city+state key, prefer verified listings
      const pickKey = (r) =>
        `${(r.name || "").toLowerCase()}|${(r.city || "").toLowerCase()}|${(
          r.state || ""
        ).toUpperCase()}`;
      const merged = new Map();
      for (const r of allRaw) {
        const k = pickKey(r);
        const curr = merged.get(k);
        if (!curr) merged.set(k, r);
        else if (r.verified && !curr.verified) merged.set(k, r);
      }
      const uniqueRaw = Array.from(merged.values());
      const normalized = uniqueRaw
        .map((r) => sanitize({ ...r, type: "sobriety", source: r.source }))
        .filter((d) => d.name && d.state);

      // Upsert into assistant collection and state-indexed soberHomes path
      const assistantCount = await upsertBatch(
        "assistant_sobriety",
        normalized
      );

      // Optional: mirror to soberHomes/{state}/homes for fast state views
      const byState = new Map();
      for (const d of normalized) {
        const key = (d.state || "").toLowerCase();
        if (!byState.has(key)) byState.set(key, []);
        byState.get(key).push({
          name: d.name,
          city: d.city,
          type: "Sober living / recovery",
          verified: d.verified,
          categories: d.tags,
          insurance: d.insurance,
          description: d.description,
          address: [d.address?.street, d.city, d.state, d.address?.zip]
            .filter(Boolean)
            .join(", "),
          contact: d.contact?.url || d.contact?.phone || d.contact?.email || "",
        });
      }
      let mirrorCount = 0;
      for (const [state, rows] of byState.entries()) {
        mirrorCount += await upsertBatch(`soberHomes/${state}/homes`, rows);
      }

      console.log(
        `syncAssistants: upserted ${assistantCount} assistants; mirrored ${mirrorCount} state home entries.`
      );
      return null;
    } catch (err) {
      console.error("syncAssistants failed", err);
      return null;
    }
  });

// Express app that handles /api/news and /api/image
exports.api = functions.https.onRequest(newsProxyApp);

// Oxford House scraper functions
const {
  scrapeOxfordHousesScheduled,
  scrapeOxfordHousesManual,
  getOxfordScrapingStatus,
} = require("./scrapeOxfordHouses");

exports.scrapeOxfordHousesScheduled = scrapeOxfordHousesScheduled;
exports.scrapeOxfordHousesManual = scrapeOxfordHousesManual;
exports.getOxfordScrapingStatus = getOxfordScrapingStatus;
