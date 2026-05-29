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

function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function portableTextToSections(
  body?: unknown[] | null,
  intro?: unknown[] | null,
): LegalSection[] {
  const sections: LegalSection[] = [];

  const introBlocks = (intro ?? []) as PortableBlock[];
  const introParagraphs = introBlocks
    .filter((b) => b?._type === "block")
    .flatMap((b) => splitLines(blockText(b)));
  if (introParagraphs.length) {
    sections.push({ title: "", content: introParagraphs });
  }

  let current: LegalSection | null = null;
  for (const raw of (body ?? []) as PortableBlock[]) {
    if (raw?._type !== "block") continue;
    const text = blockText(raw);
    if (raw.style === "h2") {
      current = { title: text, content: [] };
      sections.push(current);
    } else {
      if (!current) {
        current = { title: "", content: [] };
        sections.push(current);
      }
      current.content.push(...splitLines(text));
    }
  }

  return sections.filter((s) => s.title || s.content.length);
}
