import { DarkCatalogueHero } from "@/components/ui/dark-catalogue-hero";
import { LegalContent } from "@/components/ui/legal-content";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { getPageContent } from "@/lib/sanity.queries";
import { portableTextToSections } from "@/lib/portable-text-to-sections";
import { localizedHref, standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Metadata } from "next";

const PAGE_KEY = "terms";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const page = await getPageContent(PAGE_KEY, lang);
  return {
    title: page?.seo?.metaTitle || (lang === "fr" ? "Conditions générales | MAWT Solutions" : "Terms of Service | MAWT Solutions"),
    description:
      page?.seo?.metaDescription ||
      "Operational policies, project guidelines, and service terms for working with MAWT Solutions under Swiss governing law.",
    alternates: standaloneAlternates("conditions-generales", lang),
  };
}

const termsSectionsFallback = [
  {
    title: "1. Agreement to Terms",
    content: [
      "By using MAWT services, you agree to our operational policies, project guidelines, and service terms.",
    ],
  },
];

export default async function TermsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const [page, dict] = await Promise.all([
    getPageContent(PAGE_KEY, lang),
    getDictionary(lang),
  ]);
  const sections = page?.body ? portableTextToSections(page.body, page.intro) : termsSectionsFallback;
  const legal = dict.legalPages;

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <DarkCatalogueHero
        wordmark={legal.termsWordmark}
        crossHref={localizedHref("contact", lang)}
        crossLabel={legal.crossLabel}
        title={page?.heroH1 || "Clear operational guidelines for professional collaboration."}
      />
      <SlidePageBody>
        <LegalContent sections={sections} contentsLabel={legal.contents} />
      </SlidePageBody>
    </div>
  );
}
