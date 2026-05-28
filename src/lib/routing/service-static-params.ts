import { URL_MAP, type Locale } from "./url-map";

export interface ServiceStaticParam {
  lang: Locale;
  family: string;
  service: string;
}

/**
 * Approach B — all FR+EN family/service slug pairs from URL_MAP for
 * `src/app/[lang]/services/[family]/[service]/page.tsx` (brief 08).
 */
export function generateServicePageParams(): ServiceStaticParam[] {
  const servicesBranch = URL_MAP.find((m) => m.fr === "services");
  if (!servicesBranch?.children) return [];

  const params: ServiceStaticParam[] = [];

  for (const family of servicesBranch.children) {
    for (const service of family.children ?? []) {
      params.push(
        { lang: "fr", family: family.fr, service: service.fr },
        { lang: "en", family: family.en, service: service.en },
      );
    }
  }

  return params;
}
