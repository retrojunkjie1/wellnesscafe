/*
  Import sober homes JSON into Firestore.

  Usage:
    node src/utils/importSoberHomes.js --state=arizona --file=./path/to/arizona.json

  Notes:
  - Expects JSON of the shape:
      { state:"Arizona", code:"AZ", homes:[ { id?, name, city, ... } ] }
    or a raw array: [ { id?, name, city, ... } ]
  - If Firebase env (REACT_APP_FIREBASE_*) is missing, performs a dry run and prints what it would do.
*/

/* eslint-disable */
const fs = require("node:fs");
const path = require("node:path");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const out = {};
  for (const a of args) {
    const [k, v] = a.split("=");
    if (k && v) {
      out[k.replace(/^--/, "")] = v;
    }
  }
  return out;
};

const loadJson = (filePath) => {
  const abs = path.resolve(process.cwd(), filePath);
  const raw = fs.readFileSync(abs, "utf8");
  const data = JSON.parse(raw);
  if (Array.isArray(data)) return { homes: data };
  if (data && typeof data === "object") return data;
  throw new Error(
    "Invalid JSON format. Expected array or object with homes[]."
  );
};

const hasFirebaseEnv = () => {
  return Boolean(import.meta.env.VITE_FIREBASE_API_KEY);
};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const main = async () => {
  const { state: slug, file } = parseArgs();
  if (!slug || !file) {
    // eslint-disable-next-line no-console
    console.error(
      "Usage: node src/utils/importSoberHomes.js --state=<slug> --file=<jsonPath>"
    );
    process.exit(1);
  }

  const payload = loadJson(file);
  const homes = Array.isArray(payload.homes) ? payload.homes : [];
  if (homes.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("No homes found in provided JSON. Nothing to import.");
    process.exit(0);
  }

  if (!hasFirebaseEnv()) {
    // eslint-disable-next-line no-console
    console.log(
      `[DRY RUN] Would import ${homes.length} homes to soberHomes/${slug}/homes`
    );
    // eslint-disable-next-line no-console
    console.log(homes.slice(0, 3));
    process.exit(0);
  }

  // Dynamic import firebase ESM inside CJS
  let initializeApp, getFirestore, collection, doc, setDoc;
  try {
    ({ initializeApp } = await import("firebase/app"));
    ({ getFirestore, collection, doc, setDoc } = await import(
      "firebase/firestore"
    ));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to load Firebase SDK in Node:", err.message);
    // eslint-disable-next-line no-console
    console.log(
      `[DRY RUN] Would import ${homes.length} homes to soberHomes/${slug}/homes`
    );
    process.exit(0);
  }

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // eslint-disable-next-line no-console
  console.log(
    `Importing ${homes.length} homes to soberHomes/${slug}/homes ...`
  );
  let count = 0;
  for (const h of homes) {
    const baseId = (h.id || `${h.name || "home"}-${h.city || "city"}`)
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .join("-");
    const ref = doc(collection(db, `soberHomes/${slug}/homes`), baseId);
    try {
      await setDoc(ref, h, { merge: true });
      count += 1;
      if (count % 200 === 0) {
        // polite backoff for large imports
        await sleep(250);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Failed to write ${baseId}:`, err.message);
    }
  }
  // eslint-disable-next-line no-console
  console.log(`Done. Imported ${count}/${homes.length} homes.`);
  process.exit(0);
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Unexpected error:", err);
  process.exit(1);
});
