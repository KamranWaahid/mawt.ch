/**
 * apply-internal-links.ts — micro-mesh internal linking.
 *
 * Wraps an EXACT phrase inside a service's `longDescription` in a PortableText
 * `link` annotation (markDef) pointing to another localized service URL — the
 * text-level complement to the macro `relatedServices` mesh.
 *
 * Design constraints (all enforced):
 *   - IDEMPOTENT: re-running with the same args is a no-op. A deterministic
 *     markDef key (`link-<hash(href)>`) is reused per block; if the target
 *     phrase already carries a link to the same href, nothing is written.
 *   - PRESERVES <strong>: a link is an ANNOTATION; "strong" is a DECORATOR.
 *     Both live in a span's `marks[]` array. We APPEND the link key to existing
 *     marks, never replace — so a bolded entity becomes bold + linked.
 *   - PHRASE MAY CROSS SPAN BOUNDARIES: spans are split at the phrase edges and
 *     every sub-span within the phrase range gets the link key, each keeping its
 *     own decorators. Links and markDefs already present are left untouched.
 *   - FIRST OCCURRENCE ONLY (across the whole longDescription) by default, the
 *     SEO norm. Pass --all to link every exact occurrence.
 *
 * Token: read from .env.local (SANITY_WRITE_TOKEN). No external API.
 *
 * Usage (Node >= 20):
 *   # preview (no write):
 *   node --import tsx scripts/apply-internal-links.ts --dry <docId> "CRM intelligent" "/fr/services/solutions-ia/crm-intelligent"
 *   # apply:
 *   node --import tsx scripts/apply-internal-links.ts <docId> "CRM intelligent" "/fr/services/solutions-ia/crm-intelligent"
 *   # link every occurrence:
 *   node --import tsx scripts/apply-internal-links.ts --all <docId> "RAG" "/fr/services/solutions-ia/rag-intelligence-embarquee"
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

// ─── args / flags ─────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const DRY = argv.includes("--dry");
const ALL = argv.includes("--all");
const rest = argv.filter((a) => a !== "--dry" && a !== "--all");
const [docId, phraseRaw, href] = rest;
const phrase = (phraseRaw || "").trim();

if (!docId || !phrase || !href) {
  console.error('Usage: node --import tsx scripts/apply-internal-links.ts [--dry] [--all] <docId> "Exact phrase" "/fr/services/family/slug"');
  process.exit(1);
}
if (!href.startsWith("/")) {
  console.error(`href should be a root-relative path (got "${href}").`);
  process.exit(1);
}

// ─── token from .env.local ────────────────────────────────────────────────
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

// ─── AST types ──────────────────────────────────────────────────────────────
type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _type: string; _key: string; href?: string; [k: string]: unknown };
type Block = { _type: string; _key: string; markDefs?: MarkDef[]; children?: Span[]; [k: string]: unknown };

// Deterministic, filesystem/key-safe markDef key derived from the href, so
// re-runs reuse the same annotation instead of stacking duplicates.
function linkKeyFor(h: string): string {
  let hash = 0;
  for (let i = 0; i < h.length; i++) hash = (hash * 31 + h.charCodeAt(i)) | 0;
  return `link-${(hash >>> 0).toString(36)}`;
}

/**
 * Apply the link annotation to one block for the given [start,end) char range
 * (range computed against the block's concatenated text). Splits spans at the
 * range edges and appends the link key to in-range spans, preserving their
 * existing marks (decorators + other annotations).
 */
function linkRangeInBlock(block: Block, start: number, end: number, linkKey: string) {
  const children = block.children || [];
  const out: Span[] = [];
  let cursor = 0;
  let counter = 0;
  const mkKey = () => `${block._key}-l${counter++}`;

  for (const span of children) {
    const sStart = cursor;
    const sEnd = cursor + span.text.length;
    cursor = sEnd;

    // No overlap with [start,end): keep span as-is.
    if (sEnd <= start || sStart >= end) {
      out.push(span);
      continue;
    }

    // Overlap: cut into before / inside / after relative to the span.
    const beforeLen = Math.max(0, start - sStart);
    const afterStart = Math.min(span.text.length, end - sStart);
    const before = span.text.slice(0, beforeLen);
    const inside = span.text.slice(beforeLen, afterStart);
    const after = span.text.slice(afterStart);

    if (before) out.push({ ...span, _key: mkKey(), text: before });
    if (inside) {
      const marks = span.marks ? [...span.marks] : [];
      if (!marks.includes(linkKey)) marks.push(linkKey); // append → preserves "strong"
      out.push({ ...span, _key: mkKey(), text: inside, marks });
    }
    if (after) out.push({ ...span, _key: mkKey(), text: after });
  }

  block.children = out;
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
  const linkKey = linkKeyFor(href);

  let applied = 0;
  let alreadyLinked = 0;

  for (const block of blocks) {
    if (block._type !== "block" || !Array.isArray(block.children)) continue;

    // Find phrase occurrences in this block's concatenated text.
    const fullText = block.children.map((c) => c.text).join("");
    const ranges: Array<[number, number]> = [];
    let from = 0;
    for (;;) {
      const idx = fullText.indexOf(phrase, from);
      if (idx === -1) break;
      ranges.push([idx, idx + phrase.length]);
      from = idx + phrase.length;
      if (!ALL) break; // first occurrence in this block only
    }
    if (ranges.length === 0) continue;

    // Ensure the link markDef exists on this block (reuse by deterministic key).
    block.markDefs = block.markDefs || [];
    const existing = block.markDefs.find((m) => m._key === linkKey);
    if (existing) {
      if (existing._type !== "link" || existing.href !== href) {
        existing._type = "link";
        existing.href = href;
      }
    } else {
      block.markDefs.push({ _type: "link", _key: linkKey, href });
    }

    // Apply ranges in reverse so earlier offsets stay valid after splits.
    for (const [s, e] of ranges.reverse()) {
      // Idempotency: is this exact range already fully linked to this href?
      let cursor = 0;
      let fullyLinked = true;
      for (const sp of block.children) {
        const a = cursor;
        const b = cursor + sp.text.length;
        cursor = b;
        if (b <= s || a >= e) continue;
        if (!sp.marks || !sp.marks.includes(linkKey)) { fullyLinked = false; break; }
      }
      if (fullyLinked) { alreadyLinked++; continue; }
      linkRangeInBlock(block, s, e, linkKey);
      applied++;
    }

    if (!ALL && applied > 0) break; // first occurrence across the whole doc
  }

  console.log(`Doc: ${doc._id}  "${doc.title}"`);
  console.log(`Phrase: "${phrase}"  →  ${href}`);
  if (applied === 0 && alreadyLinked > 0) {
    console.log(`Déjà lié (${alreadyLinked}). Idempotent — aucun patch.`);
    return;
  }
  if (applied === 0) {
    console.log(`Phrase introuvable dans longDescription. Aucun patch.`);
    return;
  }
  console.log(`Liens appliqués: ${applied}${alreadyLinked ? ` (déjà liés ignorés: ${alreadyLinked})` : ""}`);

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
