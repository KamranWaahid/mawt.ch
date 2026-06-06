/**
 * inject-sentence.ts — append a sentence to a service's longDescription.
 *
 * Adds a NEW plain span (marks: []) to one block of `longDescription`, used to
 * introduce a natural anchor that apply-internal-links.ts can then wrap. Keeps
 * existing spans/marks untouched.
 *
 * Idempotent: if the sentence text already appears anywhere in longDescription,
 * nothing is written.
 *
 * Default target block index = 1 (the "solution" paragraph in our service docs),
 * clamped to the last block if fewer exist.
 *
 * Token from .env.local (SANITY_WRITE_TOKEN). No external API.
 *
 * Usage (Node >= 20):
 *   node --import tsx scripts/inject-sentence.ts [--dry] <docId> " Sentence with leading space." [blockIndex]
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry");
const rest = argv.filter((a) => a !== "--dry");
const docId = rest[0];
const sentence = rest[1];
const blockIndexArg = rest[2] !== undefined ? Number(rest[2]) : 1;

if (!docId || !sentence) {
  console.error('Usage: node --import tsx scripts/inject-sentence.ts [--dry] <docId> " Sentence." [blockIndex]');
  process.exit(1);
}

function envFromFile(key: string): string | undefined {
  try {
    const line = readFileSync(".env.local", "utf8").split("\n").find((l) => l.startsWith(`${key}=`));
    if (!line) return undefined;
    let v = line.slice(key.length + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    return v || undefined;
  } catch {
    return undefined;
  }
}
const token = process.env.SANITY_WRITE_TOKEN?.trim() || envFromFile("SANITY_WRITE_TOKEN");
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN (env or .env.local).");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || envFromFile("NEXT_PUBLIC_SANITY_PROJECT_ID") || "ewciugup",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || envFromFile("NEXT_PUBLIC_SANITY_DATASET") || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type Block = { _type: string; _key: string; children?: Span[]; [k: string]: unknown };

async function main() {
  const doc = await client.fetch<{ _id: string; title: string; longDescription: Block[] }>(
    `*[_id == $id][0]{_id, title, longDescription}`,
    { id: docId },
  );
  if (!doc) {
    console.error(`Doc ${docId} not found.`);
    process.exit(1);
  }
  const blocks: Block[] = Array.isArray(doc.longDescription) ? doc.longDescription : [];

  // Idempotency: bail if the sentence (trimmed) is already present anywhere.
  const allText = blocks
    .filter((b) => b._type === "block")
    .map((b) => (b.children || []).map((c) => c.text).join(""))
    .join("\n");
  if (allText.includes(sentence.trim())) {
    console.log(`[${doc.title}] phrase déjà présente — aucun patch.`);
    return;
  }

  const blockPositions = blocks.map((b, i) => (b._type === "block" ? i : -1)).filter((i) => i >= 0);
  if (blockPositions.length === 0) {
    console.error(`[${doc.title}] aucun bloc texte. Aucun patch.`);
    process.exit(1);
  }
  const targetPos = blockPositions[Math.min(blockIndexArg, blockPositions.length - 1)];
  const block = blocks[targetPos];
  block.children = block.children || [];
  block.children.push({
    _type: "span",
    _key: `${block._key}-inj${block.children.length}`,
    text: sentence,
    marks: [],
  });

  console.log(`[${doc.title}] phrase ajoutée au bloc index ${targetPos}: "${sentence.trim()}"`);
  if (DRY) {
    console.log("DRY RUN — aucun patch envoyé.");
    return;
  }
  await client.patch(doc._id).set({ longDescription: blocks }).commit();
  console.log("✓ Patch appliqué.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
