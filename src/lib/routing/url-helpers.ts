import { URL_MAP, type Locale, type RouteMapping } from "./url-map";

export const SITE_URL = "https://mawt.ch";

/**
 * FR-canonical standalone segment → on-disk `src/app/[lang]/` folder name.
 * The folder is language-neutral (one folder serves both locales via `params.lang`).
 * Only routes whose public slug differs from the folder need an entry here.
 * Services and dynamic `[slug]` detail routes are intentionally absent: they use
 * real localized slugs (Sanity) and must never be rewritten.
 */
const FOLDER_BY_FR_CANONICAL: Record<string, string> = {
  projets: "work",
  "a-propos": "about",
  clients: "partners",
  "notre-methode": "approach",
  securite: "security",
  confidentialite: "legal",
  "mentions-legales": "legal-notice",
  "conditions-generales": "terms",
  blog: "news",
  // contact, faqs, cookies, services → folder === fr-canonical slug.
};

function getServicesBranch(): RouteMapping | undefined {
  return URL_MAP.find((m) => m.fr === "services");
}

export function translateSegments(
  segments: string[],
  level: RouteMapping[],
  from: Locale,
  to: Locale,
): string[] {
  if (segments.length === 0) return [];
  const [head, ...rest] = segments;
  const match = level.find((m) => m[from] === head);
  if (!match) {
    return [head, ...rest];
  }
  const translatedHead = match[to];
  if (rest.length === 0) return [translatedHead];
  return [
    translatedHead,
    ...translateSegments(rest, match.children ?? [], from, to),
  ];
}

/**
 * Given a public path in one language, return the equivalent public path in the
 * other language. Unmapped segments (e.g. Sanity `[slug]` detail pages) pass through
 * unchanged — callers that need true per-document slugs should resolve those upstream.
 * Example: translatePath('/fr/services/solutions-ia/crm-intelligent', 'fr', 'en')
 *   → '/en/services/ai-solutions/smart-crm'
 */
export function translatePath(path: string, from: Locale, to: Locale): string {
  const stripped = path.replace(new RegExp(`^/${from}/?`), "").replace(/^\//, "");
  if (!stripped) return `/${to}`;

  const segments = stripped.split("/").filter(Boolean);
  const translated = translateSegments(segments, URL_MAP, from, to);
  return `/${to}/${translated.join("/")}`;
}

export function parseRoute(pathname: string): {
  locale: Locale;
  segments: string[];
} {
  const match = pathname.match(/^\/(fr|en)(\/.*)?$/);
  if (!match) {
    return { locale: "fr", segments: [] };
  }
  const locale = match[1] as Locale;
  const rest = (match[2] || "").split("/").filter(Boolean);
  return { locale, segments: rest };
}

/**
 * Generate a public path for a known FR-canonical route key, localized.
 * e.g. localizedHref('services/solutions-ia/crm-intelligent', 'en')
 *   → '/en/services/ai-solutions/smart-crm'
 *   localizedHref('a-propos', 'fr') → '/fr/a-propos'
 */
export function localizedHref(canonicalRouteKey: string, locale: Locale): string {
  const segments = canonicalRouteKey.split("/").filter(Boolean);
  const translated = translateSegments(segments, URL_MAP, "fr", locale);
  return `/${locale}/${translated.join("/")}`;
}

/**
 * Resolve a public (localized) pathname to the internal Next.js filesystem path.
 * Used by `proxy.ts` to rewrite localized URLs onto their shared on-disk folder.
 * Only top-level standalone routes are rewritten; services and `[slug]` detail
 * routes pass through untouched.
 * e.g. /fr/a-propos → /fr/about, /en/privacy → /en/legal, /fr/work/x → /fr/work/x
 */
export function toFilesystemPathname(pathname: string): string {
  const { locale, segments } = parseRoute(pathname);
  if (segments.length === 0) return pathname;

  const [head, ...rest] = segments;
  const match = URL_MAP.find((m) => m[locale] === head);
  if (!match || match.fr === "services") return pathname;

  const folder = FOLDER_BY_FR_CANONICAL[match.fr] ?? match.fr;
  if (folder === head) return pathname;

  return `/${locale}/${[folder, ...rest].join("/")}`;
}

/**
 * Build canonical + hreflang `alternates` for a page, given its own public path
 * in the current language. Works for any route — standalone, services, or a fully
 * resolved `[slug]` detail page — as long as `publicPath` is the correct localized URL.
 */
export function hreflangAlternates(publicPath: string, lang: Locale) {
  const frPath = lang === "fr" ? publicPath : translatePath(publicPath, lang, "fr");
  const enPath = lang === "en" ? publicPath : translatePath(publicPath, lang, "en");
  return {
    canonical: `${SITE_URL}${publicPath}`,
    languages: {
      fr: `${SITE_URL}${frPath}`,
      en: `${SITE_URL}${enPath}`,
      "x-default": `${SITE_URL}${enPath}`,
    },
  };
}

/**
 * Convenience wrapper for standalone pages: pass the FR-canonical key and current
 * locale, get back canonical + hreflang alternates.
 * e.g. standaloneAlternates('a-propos', 'fr')
 */
export function standaloneAlternates(canonicalRouteKey: string, lang: Locale) {
  return hreflangAlternates(localizedHref(canonicalRouteKey, lang), lang);
}

/** Stable FR family key (e.g. solutions-ia) → localized URL segment. */
export function familySlugForLang(
  canonicalFamilyKey: string,
  locale: Locale,
): string {
  const family = getServicesBranch()?.children?.find(
    (f) => f.fr === canonicalFamilyKey,
  );
  return family ? family[locale] : canonicalFamilyKey;
}

export function canonicalizeFamilySlug(
  familySlug: string,
  locale: Locale,
): string | null {
  const family = getServicesBranch()?.children?.find(
    (f) => f[locale] === familySlug,
  );
  return family?.fr ?? null;
}

const FAMILY_TITLES: Record<string, { fr: string; en: string }> = {
  "sites-et-branding": { fr: "Sites & Branding", en: "Sites & Branding" },
  "solutions-ia": { fr: "Solutions IA", en: "AI Solutions" },
  "conseil-ia": { fr: "Conseil IA", en: "AI Consulting" },
  "formation-ia": { fr: "Formation IA", en: "AI Training" },
  "renfort-equipe": { fr: "Renfort & Équipe", en: "Team Augmentation" },
};

export function getFamilyTitle(family: string, lang: "fr" | "en"): string {
  return FAMILY_TITLES[family]?.[lang] ?? family;
}

// Canonical display order for service families: AI offers lead, per the
// "agence IA" positioning. Used everywhere families are listed.
export const FAMILY_ORDER = [
  "solutions-ia",
  "conseil-ia",
  "formation-ia",
  "sites-et-branding",
  "renfort-equipe",
] as const;

export function familyOrderIndex(family: string): number {
  const i = FAMILY_ORDER.indexOf(family as (typeof FAMILY_ORDER)[number]);
  return i === -1 ? FAMILY_ORDER.length : i;
}
