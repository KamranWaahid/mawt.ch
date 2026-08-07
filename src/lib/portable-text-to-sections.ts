/**
 * Convert a `pageContent` Portable Text body (h2 headings + normal paragraphs)
 * into the `{ title, content: string[] }[]` shape consumed by <LegalContent>.
 *
 * - An h2 block starts a new section (its text is the title).
 * - Normal blocks become content paragraphs of the current section.
 * - Single line breaks inside a block are split into separate paragraphs
 *   (lists were authored with "\n" between items).
 * - An optional `intro` is prepended as a leading, title-less section.
 */
import {
  fillPlaceholders,
  hasUnresolvedPlaceholder,
  type LegalLocale,
} from "./legal-placeholders";

interface PortableSpan {
  text?: string;
}
interface PortableBlock {
  _type?: string;
  style?: string;
  children?: PortableSpan[];
}

export interface LegalSection {
  title: string;
  content: string[];
}

function blockText(block: PortableBlock): string {
  return (block.children ?? []).map((c) => c.text ?? "").join("");
}

/**
 * Split a block into paragraphs, filling CMS placeholders first.
 *
 * Substitution happens before the split because `[ADRESSE]` expands to a
 * multi-line postal block. Any line still carrying a token afterwards is
 * dropped, so a raw `[GERANT]` never reaches a visitor.
 */
function splitLines(text: string, lang: LegalLocale, updatedAt?: string): string[] {
  return fillPlaceholders(text, lang, updatedAt)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !hasUnresolvedPlaceholder(line));
}

export function portableTextToSections(
  body?: unknown[] | null,
  intro?: unknown[] | null,
  lang: LegalLocale = "en",
  updatedAt?: string,
): LegalSection[] {
  const sections: LegalSection[] = [];

  const introBlocks = (intro ?? []) as PortableBlock[];
  const introParagraphs = introBlocks
    .filter((b) => b?._type === "block")
    .flatMap((b) => splitLines(blockText(b), lang, updatedAt));
  if (introParagraphs.length) {
    sections.push({ title: "", content: introParagraphs });
  }

  let current: LegalSection | null = null;
  for (const raw of (body ?? []) as PortableBlock[]) {
    if (raw?._type !== "block") continue;
    const text = blockText(raw);
    if (raw.style === "h2") {
      current = { title: fillPlaceholders(text, lang, updatedAt), content: [] };
      sections.push(current);
    } else {
      if (!current) {
        current = { title: "", content: [] };
        sections.push(current);
      }
      current.content.push(...splitLines(text, lang, updatedAt));
    }
  }

  return sections.filter((s) => s.title || s.content.length);
}
