import { URL_MAP, type Locale, type RouteMapping } from "./url-map";

/** FR-canonical segment → on-disk `src/app/[lang]/` folder name (interim until brief 09). */
const FILESYSTEM_BY_FR_CANONICAL: Record<string, { fr: string; en: string }> = {
  projets: { fr: "projects", en: "projects" },
  "a-propos": { fr: "about", en: "about" },
  clients: { fr: "clients", en: "partners" },
  "notre-methode": { fr: "notre-methode", en: "our-process" },
  securite: { fr: "securite", en: "security" },
  "mentions-legales": { fr: "legal", en: "legal" },
  confidentialite: { fr: "legal", en: "legal" },
  "conditions-utilisation": { fr: "terms", en: "terms" },
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
 * Given a path in one language, return the equivalent path in the other language.
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
  canonical: string;
} {
  const match = pathname.match(/^\/(fr|en)(\/.*)?$/);
  if (!match) {
    return { locale: "fr", segments: [], canonical: "/fr" };
  }
  const locale = match[1] as Locale;
  const rest = (match[2] || "").split("/").filter(Boolean);
  return { locale, segments: rest, canonical: pathname };
}

/**
 * Generate a static link for a known route (canonical FR slug path), with locale awareness.
 * e.g. localizedHref('services/solutions-ia/crm-intelligent', 'en')
 *   → '/en/services/ai-solutions/smart-crm'
 */
export function localizedHref(canonicalRouteKey: string, locale: Locale): string {
  const segments = canonicalRouteKey.split("/").filter(Boolean);
  const translated = translateSegments(segments, URL_MAP, "fr", locale);
  return `/${locale}/${translated.join("/")}`;
}

/** Public URL segments → FR-canonical segments (B3 map). */
export function segmentsToFrCanonical(
  segments: string[],
  locale: Locale,
): string[] {
  let level = URL_MAP;
  const result: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const match = level.find((m) => m[locale] === seg);
    if (!match) {
      return [...result, ...segments.slice(i)];
    }
    result.push(match.fr);
    level = match.children ?? [];
  }

  return result;
}

/** FR-canonical segments → on-disk app router folder names. */
export function frCanonicalToFilesystem(
  segments: string[],
  locale: Locale,
): string[] {
  return segments.map((seg) => {
    const asymmetric = FILESYSTEM_BY_FR_CANONICAL[seg];
    if (asymmetric) return asymmetric[locale];
    return seg;
  });
}

/**
 * Resolve public B3 pathname to internal Next.js filesystem path (middleware rewrite).
 * e.g. /en/projects → /en/projects (filesystem), /fr/projets → /fr/projects (interim)
 */
export function toFilesystemPathname(pathname: string): string {
  const { locale, segments } = parseRoute(pathname);
  if (segments.length === 0) return pathname;

  const frCanonical = segmentsToFrCanonical(segments, locale);
  const fsSegments = frCanonicalToFilesystem(frCanonical, locale);
  const fsPath = `/${locale}/${fsSegments.join("/")}`;

  return fsPath === pathname ? pathname : fsPath;
}

export function isValidRoute(segments: string[], locale: Locale): boolean {
  if (segments.length === 0) return true;

  let level: RouteMapping[] = URL_MAP;
  for (const segment of segments) {
    const match = level.find((m) => m[locale] === segment);
    if (!match) {
      return true;
    }
    level = match.children ?? [];
  }
  return true;
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

