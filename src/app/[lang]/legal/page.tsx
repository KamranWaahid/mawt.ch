import { brandSafeTitle } from "@/lib/seo-meta";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { LegalContent } from "@/components/ui/legal-content";
import { withLastUpdated, type LegalSection } from "@/lib/legal-sections";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { getPageContent } from "@/lib/sanity.queries";
import { portableTextToSections } from "@/lib/portable-text-to-sections";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Metadata } from "next";

const PAGE_KEY = "privacy";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const [page, dictionary] = await Promise.all([getPageContent(PAGE_KEY, lang), getDictionary(lang)]);
  const copy = dictionary.privacy;

  return {
    title: brandSafeTitle(page?.seo?.metaTitle || copy.metaTitle),
    description: page?.seo?.metaDescription || copy.metaDescription,
    alternates: standaloneAlternates("confidentialite", lang),
  };
}

export default async function LegalPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const [page, dictionary] = await Promise.all([getPageContent(PAGE_KEY, lang), getDictionary(lang)]);
  const copy = dictionary.privacy;

  // Sanity stays the source of truth when a privacy document exists; otherwise
  // the localised dictionary copy is used, prefixed with the last-updated line.
  const sections: LegalSection[] = page?.body
    ? portableTextToSections(page.body, page.intro, lang, page._updatedAt)
    : withLastUpdated(copy);

  return (
    <div className="min-h-screen">
      <SubpageHero badge={copy.badge} title={page?.heroH1 || copy.title} />
      <LegalContent sections={sections} />
    </div>
  );
}
