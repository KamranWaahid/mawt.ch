/**
 * Shared section model for the legal pages (privacy, terms, cookies, security).
 *
 * This lives outside `legal-content.tsx` on purpose: that file is a "use client"
 * module, so anything exported from it reaches a server component as a client
 * reference rather than a callable function. The server pages build their
 * section list here, then hand the result to the client component as props.
 */

/**
 * A block inside a legal section. A bare string stays a paragraph, so the
 * existing `string[]` shape used by legal-notice and by
 * `portableTextToSections` keeps working untouched.
 */
export type LegalBlock =
  | string
  | { type: "subtitle"; text: string }
  | { type: "list"; items: string[] }
  | { type: "lines"; items: string[] };

export interface LegalSection {
  title: string;
  content: LegalBlock[];
}

/**
 * Builds the section list for a legal page from its dictionary copy, putting
 * the "last updated" line first. When the copy already opens with an untitled
 * section (an intro paragraph), the timestamp joins it so the two read as one
 * block instead of being separated by a full section gap.
 */
export function withLastUpdated(copy: { lastUpdated: string; sections: LegalSection[] }): LegalSection[] {
  const [first, ...rest] = copy.sections;

  return first && !first.title
    ? [{ title: "", content: [copy.lastUpdated, ...first.content] }, ...rest]
    : [{ title: "", content: [copy.lastUpdated] }, ...copy.sections];
}
