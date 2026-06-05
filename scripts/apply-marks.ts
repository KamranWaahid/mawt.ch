/**
 * apply-marks.ts — add the `strong` decorator to exact phrases inside a
 * service's `longDescription` PortableText, without rewriting any text.
 *
 * GEO "invisible semantics": <strong> is rendered flat by the site CSS, but
 * gives RAG/AI Overview parsers strong entity signals.
 *
 * How it works (safe + idempotent):
 *   - Walks every `block` in longDescription.
 *   - For each phrase, splits ONLY plain spans (marks == []) on exact, verbatim
 *     occurrences, wrapping each hit in a span with marks:["strong"].
 *   - Spans that already carry a mark (existing links via markDefs, or a prior
 *     `strong`) are passed through UNTOUCHED — links are preserved and re-runs
 *     never double-bold.
 *   - markDefs are kept verbatim. Block _key/style/listItem/level preserved.
 *
 * Token: read from .env.local (SANITY_WRITE_TOKEN) — no external API, no dotenv.
 *
 * Usage (Node >= 20):
 *   node --import tsx scripts/apply-marks.ts <docId> "Phrase A" "Phrase B" ...
 *   node --import tsx scripts/apply-marks.ts --dry <docId> "Suisse romande" "TWINT"
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

// ─── flags / args ─────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const DRY = argv.includes("--dry");
const rest = argv.filter((a) => a !== "--dry");
const docId = rest[0];
const phrases = [...new Set(rest.slice(1).filter((p) => p && p.trim().length > 1))].sort(
  (a, b) => b.length - a.length, // longest first: avoid a short phrase pre-splitting a longer one
);

if (!docId || phrases.length === 0) {
  console.error('Usage: node --import tsx scripts/apply-marks.ts [--dry] <docId> "Phrase A" "Phrase B" ...');
  process.exit(1);
}

// ─── token from .env.local ────────────────────────────────────────────────
function envFromFile(key: string): string | undefined {
  try {
    const line = readFileSync(".env.local", "utf8")
      .split("\n")
      .find((l) => l.startsWith(`${key}=`));
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

// ─── AST types ──────────────────────────────────────────────────────────────
type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type Block = {
  _type: string;
  _key: string;
  children?: Span[];
  markDefs?: unknown[];
  [k: string]: unknown;
};

/** Split a single PLAIN span into bold/non-bold sub-spans on verbatim phrase hits. */
function splitSpan(span: Span, baseKey: string, counter: { n: number }): { spans: Span[]; applied: string[] } {
  // segments accumulate as we apply each phrase in turn
  let segments: { text: string; strong: boolean }[] = [{ text: span.text, strong: false }];
  const applied: string[] = [];

  for (const phrase of phrases) {
    let hit = false;
    const next: { text: string; strong: boolean }[] = [];
    for (const seg of segments) {
      if (seg.strong || !seg.text.includes(phrase)) {
        next.push(seg);
        continue;
      }
      const parts = seg.text.split(phrase);
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) next.push({ text: parts[i], strong: false });
        if (i < parts.length - 1) {
          next.push({ text: phrase, strong: true });
          hit = true;
        }
      }
    }
    segments = next;
    if (hit) applied.push(phrase);
  }

  if (applied.length === 0) return { spans: [span], applied };

  const spans: Span[] = segments
    .filter((s) => s.text.length > 0)
    .map((s) => ({
      _type: "span",
      _key: `${baseKey}-m${counter.n++}`,
      text: s.text,
      marks: s.strong ? ["strong"] : [],
    }));
  return { spans, applied };
}

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
  const counter = { n: 0 };
  const appliedAll = new Set<string>();
  let touchedBlocks = 0;

  const newBlocks = blocks.map((block) => {
    if (block._type !== "block" || !Array.isArray(block.children)) return block;
    let changed = false;
    const newChildren: Span[] = [];
    for (const span of block.children) {
      // Only split plain spans → links/markDefs and prior strong are preserved (idempotent).
      if (span._type === "span" && (!span.marks || span.marks.length === 0)) {
        const { spans, applied } = splitSpan(span, block._key, counter);
        if (applied.length) {
          changed = true;
          applied.forEach((p) => appliedAll.add(p));
        }
        newChildren.push(...spans);
      } else {
        newChildren.push(span);
      }
    }
    if (changed) touchedBlocks++;
    return changed ? { ...block, markDefs: block.markDefs || [], children: newChildren } : block;
  });

  const notFound = phrases.filter((p) => !appliedAll.has(p));
  console.log(`Doc: ${doc._id}  "${doc.title}"`);
  console.log(`Phrases boldée(s) (${appliedAll.size}/${phrases.length}): ${JSON.stringify([...appliedAll])}`);
  if (notFound.length) console.log(`⚠ Non trouvées verbatim (ignorées): ${JSON.stringify(notFound)}`);
  console.log(`Blocs modifiés: ${touchedBlocks}/${blocks.length}`);

  if (appliedAll.size === 0) {
    console.log("Rien à appliquer (déjà fait, ou aucune correspondance). Aucun patch.");
    return;
  }
  if (DRY) {
    console.log("DRY RUN — aucun patch envoyé.");
    return;
  }
  await client.patch(doc._id).set({ longDescription: newBlocks }).commit();
  console.log("✓ Patch appliqué.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
