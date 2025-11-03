/*
  Import first-batch state JSONs for CA, FL, TX, NY if present.
  Looks for multiple filename variants under src/data/soberHomes/states/ .

  Usage:
    node scripts/import-batch.js
*/

/* eslint-disable */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = process.cwd();
const STATES_DIR = path.join(ROOT, "src", "data", "soberHomes", "states");

const targets = [
  {
    slug: "california",
    names: ["california.json", "ca.json", "CA.json"],
  },
  { slug: "florida", names: ["florida.json", "fl.json", "FL.json"] },
  { slug: "texas", names: ["texas.json", "tx.json", "TX.json"] },
  {
    slug: "new-york",
    names: ["new-york.json", "newyork.json", "ny.json", "NY.json"],
  },
];

const findFile = (names) => {
  for (const n of names) {
    const p = path.join(STATES_DIR, n);
    if (fs.existsSync(p)) return p;
  }
  return null;
};

for (const t of targets) {
  const file = findFile(t.names);
  if (!file) {
    console.log(`[SKIP] No JSON found for ${t.slug} in ${STATES_DIR}`);
    continue;
  }
  console.log(`[IMPORT] ${t.slug} ← ${path.relative(ROOT, file)}`);
  const res = spawnSync(
    "node",
    ["src/utils/importSoberHomes.js", `--state=${t.slug}`, `--file=${file}`],
    { stdio: "inherit" }
  );
  if (res.error) {
    console.error(`[ERROR] Failed importing ${t.slug}:`, res.error.message);
  } else if (res.status !== 0) {
    console.error(
      `[WARN] Importer exited with code ${res.status} for ${t.slug}`
    );
  }
}
