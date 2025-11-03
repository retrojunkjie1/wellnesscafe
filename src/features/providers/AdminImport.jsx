import React, { useRef, useState } from "react";
import { STATE_META } from "../../data/soberHomes";
import { getApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const stateOptions = Object.entries(STATE_META)
  .map(([slug, meta]) => ({ slug, name: meta.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const toId = (h) => {
  const name = (h.name || "home").toString().toLowerCase().trim();
  const city = (h.city || h.address || "").toString().toLowerCase().trim();
  return `${name}-${city}`
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)/g, "");
};

const normalizeHome = (h) => {
  // unify categories key
  let categories = [];
  if (Array.isArray(h.categories)) categories = h.categories;
  else if (Array.isArray(h.category)) categories = h.category;
  else if (typeof h.category === "string") categories = [h.category];
  // unify insurance key
  let insurance = h.insurance ?? h.insuranceType ?? h.insuranceTypes;
  if (typeof insurance === "string") {
    insurance = insurance
      .split(/[,/|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(insurance)) {
    insurance = insurance ? [String(insurance)] : [];
  }
  // contact object normalization
  const contact =
    typeof h.contact === "object" && h.contact
      ? h.contact
      : {
          website: h.website || undefined,
          phone: h.phone || undefined,
          email: h.email || undefined,
        };
  return { ...h, categories, insurance, contact };
};

const AdminImport = () => {
  const [slug, setSlug] = useState("");
  const [preview, setPreview] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);

  const loadJson = async (file) => {
    const text = await file.text();
    const data = JSON.parse(text);
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.homes)) return data.homes;
    return [];
  };

  const handlePreview = async () => {
    setMsg("");
    const f = fileRef.current?.files?.[0];
    if (!slug) {
      setMsg("Select a state");
      return;
    }
    if (!f) {
      setMsg("Choose a JSON file");
      return;
    }
    try {
      const homes = await loadJson(f);
      const norm = homes.map(normalizeHome);
      setPreview(norm);
      setMsg(`Loaded ${norm.length} homes`);
    } catch (e) {
      setMsg(`Failed to parse JSON: ${e?.message || e}`);
    }
  };

  const handleImport = async () => {
    if (!preview.length) {
      setMsg("Nothing to import");
      return;
    }
    setBusy(true);
    setMsg("Importing...");
    try {
      const app = getApp();
      const db = getFirestore(app);
      let count = 0;
      for (const h of preview) {
        const id = toId(h);
        const ref = doc(collection(db, `soberHomes/${slug}/homes`), id);
        await setDoc(ref, h, { merge: true });
        count += 1;
        if (count % 200 === 0) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }
      setMsg(`Imported ${count} homes to ${STATE_META[slug]?.name || slug}`);
    } catch (e) {
      setMsg(`Import failed: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container max-w-[980px] my-8 mx-auto px-4">
      <div className="page-hero">
        <h1>Admin JSON Import</h1>
        <p>Upload a JSON file to import sober homes into Firestore.</p>
      </div>

      <div className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full md:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm"
            aria-label="Select state"
          >
            <option value="">Select state…</option>
            {stateOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="application/json"
            ref={fileRef}
            className="w-full md:flex-1"
          />
          <button
            type="button"
            className="ghost-btn"
            onClick={handlePreview}
            disabled={busy}
          >
            Preview
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={handleImport}
            disabled={busy || !preview.length || !slug}
          >
            {busy ? "Importing…" : "Import to Firestore"}
          </button>
        </div>
        {msg && <div className="text-sm text-gray-700">{msg}</div>}
      </div>

      {!!preview.length && (
        <section className="card-grid section mt-4">
          {preview.slice(0, 12).map((h) => {
            const key = toId(h);
            return (
              <div key={key} className="p-card">
                <h3>{h.name}</h3>
                <p className="text-gray-700 my-1.5">{h.address || h.city}</p>
                <p className="text-gray-800 my-1.5">
                  {Array.isArray(h.insurance) ? h.insurance.join(", ") : ""}
                </p>
                {Array.isArray(h.categories) && h.categories.length > 0 && (
                  <p className="my-1.5">
                    {h.categories.map((c) => (
                      <span key={c} className="specialty-tag mr-1.5">
                        {c}
                      </span>
                    ))}
                  </p>
                )}
                {h.verified && (
                  <span className="specialty-tag mr-1.5">Verified</span>
                )}
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default AdminImport;
