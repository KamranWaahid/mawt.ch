#!/usr/bin/env node
/**
 * Push generated SEO/GEO content (/tmp/mawt-out/*.json) into the 70 Sanity `service` docs.
 * Maps the generated shape -> v19 schema fields, resolves internalLinks to
 * relatedServices (service refs) + featuredProjects (project refs).
 *
 *   node scripts/push-rich-service-content.mjs            # dry run (writes /tmp/mawt-push/*, no Sanity writes)
 *   node scripts/push-rich-service-content.mjs --commit   # patch the 70 docs in Sanity
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const COMMIT = process.argv.includes("--commit");
const OUT_DIR = "/tmp/mawt-out";
const SVC_DIR = "/tmp/mawt-svc";
const PUSH_DIR = "/tmp/mawt-push";

// --- load env from .env.local ---
const env = {};
for (const line of fs.readFileSync(path.resolve(".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ewciugup",
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2021-10-21",
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// --- build lookup maps ---
const serviceId = new Map(); // `${slug}__${lang}` -> _id
const serviceSlugs = new Set();
for (const f of fs.readdirSync(SVC_DIR)) {
  if (f.startsWith("_") || !f.endsWith(".json")) continue;
  const d = JSON.parse(fs.readFileSync(path.join(SVC_DIR, f), "utf8"));
  serviceId.set(`${d.slug}__${d.language}`, d.id);
  serviceSlugs.add(d.slug);
}
const projById = {}; // slug -> { lang -> id }
for (const p of JSON.parse(fs.readFileSync(path.join(SVC_DIR, "_raw_projects_ids.json"), "utf8")).result) {
  if (!p.slug) continue;
  (projById[p.slug] ||= {})[p.language || "x"] = p.id;
}
function projectId(slug, lang) {
  const m = projById[slug];
  if (!m) return null;
  return m[lang] || m.x || Object.values(m)[0] || null;
}

const ref = (id, i) => ({ _type: "reference", _key: `ref-${i}`, _ref: id });

function transform(c) {
  const lang = c.langCode;
  const relatedServices = [];
  const featuredProjects = [];
  let ri = 0, pi = 0;
  for (const l of c.internalLinks || []) {
    const ts = l.targetSlug;
    if (serviceSlugs.has(ts)) {
      const id = serviceId.get(`${ts}__${lang}`);
      if (id) relatedServices.push(ref(id, ri++));
    } else {
      const id = projectId(ts, lang);
      if (id) featuredProjects.push(ref(id, pi++));
    }
  }
  const set = {
    heroH1: c.heroH1,
    heroH2: c.heroH2,
    answerBox: c.answerBox,
    whoFor: c.whoFor,
    sections: (c.sections || []).map((s, i) => ({
      _type: "contentSection",
      _key: `sec-${i}`,
      h2: s.h2,
      paragraphs: s.paragraphs || [],
      bullets: s.bullets || [],
    })),
    deliverables: c.deliverables || [],
    keyTakeaways: c.keyTakeaways || [],
    faq: (c.faq || []).map((f, i) => ({
      _type: "faqItem",
      _key: `faq-${i}`,
      question: f.q,
      answer: f.a,
    })),
    cta: {
      headline: c.cta?.headline,
      primaryLabel: c.cta?.primary,
      secondaryLabel: c.cta?.secondary,
    },
    "seo.metaTitle": c.metaTitle,
    "seo.metaDescription": c.metaDescription,
  };
  const ct = c.comparisonTable;
  if (ct && ct.rows && ct.rows.length) {
    set.comparisonTable = {
      title: ct.title,
      columns: ct.columns || [],
      rows: ct.rows.map((r, i) => ({ _type: "tableRow", _key: `row-${i}`, cells: r.cells || [] })),
    };
  }
  if (relatedServices.length) set.relatedServices = relatedServices;
  if (featuredProjects.length) set.featuredProjects = featuredProjects;
  return set;
}

const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".json")).sort();
if (!COMMIT) fs.mkdirSync(PUSH_DIR, { recursive: true });

let ok = 0, missing = 0, relTot = 0, projTot = 0;
const errors = [];

for (const f of files) {
  const key = f.replace(/\.json$/, "");
  const c = JSON.parse(fs.readFileSync(path.join(OUT_DIR, f), "utf8"));
  const id = serviceId.get(`${c.slug}__${c.langCode}`);
  if (!id) { missing++; errors.push(`NO DOC ID for ${key}`); continue; }
  const set = transform(c);
  relTot += (set.relatedServices || []).length;
  projTot += (set.featuredProjects || []).length;
  if (COMMIT) {
    try {
      await client.patch(id).set(set).commit({ autoGenerateArrayKeys: false });
      ok++;
      if (ok % 10 === 0) console.log(`  patched ${ok}/${files.length}...`);
    } catch (e) {
      errors.push(`PATCH FAIL ${key}: ${e.message}`);
    }
  } else {
    fs.writeFileSync(path.join(PUSH_DIR, f), JSON.stringify({ _id: id, set }, null, 2));
    ok++;
  }
}

console.log(`\n${COMMIT ? "COMMITTED" : "DRY RUN"}: ${ok}/${files.length} services`);
console.log(`relatedServices refs: ${relTot} | featuredProjects refs: ${projTot} | missing doc ids: ${missing}`);
if (!COMMIT) console.log(`Transformed payloads written to ${PUSH_DIR}/`);
if (errors.length) { console.log("\nERRORS:"); errors.forEach((e) => console.log("  " + e)); }
