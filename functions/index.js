/*
  AI endpoint using Google Generative AI (Gemini) via Firebase Functions.
  Configure secret: GENAI_API_KEY (firebase functions:secrets:set GENAI_API_KEY)
*/

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

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
