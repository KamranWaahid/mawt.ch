// One-shot cleanup: the MAWT voice rules ban "scale-up(s)" in copy.
// FR -> "entreprise(s) (commerciale(s)) en croissance", EN -> "growing (commercial) company/companies".
// Walks every string (incl. portable-text spans) of content docs and patches in place.
// Run with --dry to preview. Skips docs that have an open draft (would be clobbered on publish).
import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);

const client = createClient({
  projectId: env.SANITY_PROJECT_ID || "ewciugup",
  dataset: env.SANITY_DATASET || "production",
  token: env.SANITY_WRITE_TOKEN,
  apiVersion: env.SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
});

const DRY = process.argv.includes("--dry");

// Ordered: longest, most specific first so the generic rules don't eat the
// specific ones. Case variants handled per rule.
const RULES_FR = [
  [/scale[- ]ups commerciales/gi, "entreprises commerciales en croissance"],
  [/scale[- ]up commerciale/gi, "entreprise commerciale en croissance"],
  [/scale[- ]ups suisses/gi, "entreprises suisses en croissance"],
  [/scale[- ]ups/gi, "entreprises en croissance"],
  [/scale[- ]up/gi, "entreprise en croissance"],
];
const RULES_EN = [
  [/commercial scale[- ]ups/gi, "growing commercial companies"],
  [/commercial scale[- ]up/gi, "growing commercial company"],
  [/Swiss scale[- ]ups/gi, "growing Swiss companies"],
  [/scale[- ]ups/gi, "growing companies"],
  [/scale[- ]up/gi, "growing company"],
];

function fixString(s, rules) {
  let out = s;
  for (const [re, rep] of rules) out = out.replace(re, rep);
  return out;
}

// Recursively rewrite strings; returns [value, changed]
function walk(value, rules) {
  if (typeof value === "string") {
    const v = fixString(value, rules);
    return [v, v !== value];
  }
  if (Array.isArray(value)) {
    let changed = false;
    const arr = value.map((item) => {
      const [v, c] = walk(item, rules);
      changed = changed || c;
      return v;
    });
    return [arr, changed];
  }
  if (value && typeof value === "object") {
    let changed = false;
    const obj = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("_") && k !== "_key" && k !== "_type") {
        obj[k] = v;
        continue;
      }
      const [nv, c] = walk(v, rules);
      obj[k] = nv;
      changed = changed || c;
    }
    return [obj, changed];
  }
  return [value, false];
}

const TYPES = ["service", "faq", "project", "post", "aboutContent", "methodPage", "securityPage", "testimonial"];
const docs = await client.fetch(`*[_type in $types && !(_id in path("drafts.**"))]`, { types: TYPES });
const draftIds = new Set(
  (await client.fetch(`*[_id in path("drafts.**") && _type in $types]._id`, { types: TYPES })).map((id) =>
    id.replace(/^drafts\./, "")
  )
);

let patched = 0,
  skipped = 0;
for (const doc of docs) {
  const rules = doc.language === "fr" ? RULES_FR : doc.language === "en" ? RULES_EN : RULES_EN;
  const { _id, _rev, _createdAt, _updatedAt, ...fields } = doc;
  const [next, changed] = walk(fields, rules);
  if (!changed) continue;
  if (draftIds.has(_id)) {
    console.log(`SKIP (open draft): ${_id} ${doc.title || doc.question || ""}`);
    skipped++;
    continue;
  }
  if (DRY) {
    console.log(`WOULD PATCH: ${doc._type} ${_id} (${doc.language}) ${doc.title || doc.question || ""}`);
  } else {
    await client.patch(_id).set(next).commit();
    console.log(`PATCHED: ${doc._type} ${_id} (${doc.language}) ${doc.title || doc.question || ""}`);
  }
  patched++;
}
console.log(`${DRY ? "[dry run] " : ""}done: ${patched} docs ${DRY ? "would be " : ""}patched, ${skipped} skipped (drafts).`);
