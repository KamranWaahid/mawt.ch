/**
 * Placeholder substitution for CMS-authored legal copy.
 *
 * The `pageContent` documents for privacy / terms / cookies / legal-notice were
 * seeded from templates and still contain tokens like `[DATE_MAJ]` and
 * `[EMAIL]`. Those were reaching visitors verbatim — including, on the privacy
 * page, "write to us at [EMAIL]" as the address for exercising data rights.
 *
 * This is a render-time guarantee, not a substitute for fixing the documents:
 * whatever the CMS contains, a visitor never sees a raw `[TOKEN]`. It also
 * protects against a placeholder being reintroduced in Studio later.
 *
 * Two behaviours:
 *   - a token we have a value for is substituted;
 *   - a token we do not (company registration numbers, the named legal
 *     representative) causes its whole line to be dropped, since a legal page
 *     is better without a field than with a visible placeholder.
 */

export type LegalLocale = "en" | "fr";

/** Values that are the same in both languages. */
const SHARED = {
  "[RAISON_SOCIALE]": "Marketing & Web Technologies Sàrl",
  "[EMAIL]": "info@mawt.ch",
  "[TELEPHONE]": "+41 76 636 33 33",
  "[URL]": "mawt.ch",
  "[HEBERGEUR]": "Hostinger",
} as const;

const LOCALISED: Record<LegalLocale, Record<string, string>> = {
  // The address deliberately expands to two lines: callers split on "\n", so it
  // renders as a postal block rather than one run-on line.
  en: { "[ADRESSE]": "Rue de la Fontenette 23\n1227 Carouge (Geneva)" },
  fr: { "[ADRESSE]": "Rue de la Fontenette 23\n1227 Carouge (Genève)" },
};

/**
 * Tokens with no value available. The line carrying one is removed entirely.
 * Move a token out of here and into SHARED/LOCALISED once the real value is
 * known — the Swiss company number (IDE) in particular belongs on the legal
 * notice and should be restored when available.
 */
const UNKNOWN = ["[GERANT]", "[IDE]", "[TVA]"];

const TOKEN = /\[[A-Z_]+\]/;

const MONTHS: Record<LegalLocale, string[]> = {
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  fr: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
};

/**
 * "Last updated" reflects when the document itself last changed in the CMS,
 * so it stays truthful without anyone maintaining a hardcoded date.
 */
export function formatUpdatedAt(iso: string | undefined, lang: LegalLocale): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const day = d.getUTCDate();
  const month = MONTHS[lang][d.getUTCMonth()];
  return lang === "fr"
    ? `${day === 1 ? "1er" : day} ${month} ${d.getUTCFullYear()}`
    : `${day} ${month} ${d.getUTCFullYear()}`;
}

/**
 * Substitute every known token in `text`. Returns the filled string; lines that
 * still carry an unresolved token are the caller's to drop (see `dropUnresolved`).
 */
export function fillPlaceholders(text: string, lang: LegalLocale, updatedAt?: string): string {
  if (!TOKEN.test(text)) return text;

  let out = text;
  const date = formatUpdatedAt(updatedAt, lang);
  const map: Record<string, string> = {
    ...SHARED,
    ...LOCALISED[lang],
    ...(date ? { "[DATE_MAJ]": date } : {}),
  };

  for (const [token, value] of Object.entries(map)) {
    if (out.includes(token)) out = out.split(token).join(value);
  }
  return out;
}

/**
 * True when a line still carries a token after substitution, i.e. it must not
 * be rendered. This covers the known-unfillable list (UNKNOWN) and any token
 * added to the CMS later that nothing here knows about — both are better
 * dropped than shown.
 */
export function hasUnresolvedPlaceholder(line: string): boolean {
  return TOKEN.test(line);
}

/** Exposed for tests/diagnostics: tokens we knowingly cannot fill. */
export const UNFILLABLE_TOKENS = UNKNOWN;
