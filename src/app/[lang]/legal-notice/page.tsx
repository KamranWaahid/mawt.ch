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

const PAGE_KEY = "legal-notice";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const page = await getPageContent(PAGE_KEY, lang);
  return {
    title:
      page?.seo?.metaTitle ||
      (lang === "fr" ? "Mentions légales | MAWT" : "Legal Notice | MAWT"),
    description:
      page?.seo?.metaDescription ||
      (lang === "fr"
        ? "Mentions légales de MAWT Solutions : éditeur, hébergement et informations réglementaires."
        : "Legal notice for MAWT Solutions: publisher, hosting and regulatory information."),
    alternates: standaloneAlternates("mentions-legales", lang),
  };
}

const fallbackSections = [
  {
    title: "1. Publisher",
    content: [
      "This website is published by MAWT Solutions.",
      "For any question regarding this legal notice, contact us through the contact page.",
    ],
  },
];

export default async function LegalNoticePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const [page, dict] = await Promise.all([
    getPageContent(PAGE_KEY, lang),
    getDictionary(lang),
  ]);
  const sections = page?.body ? portableTextToSections(page.body, page.intro) : fallbackSections;
  const legal = dict.legalPages;

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <DarkCatalogueHero
        wordmark={lang === "fr" ? "mentions" : "legal"}
        crossHref={localizedHref("contact", lang)}
        crossLabel={legal.crossLabel}
        title={page?.heroH1 || (lang === "fr" ? "Mentions légales" : "Legal Notice")}
      />
      <SlidePageBody>
        <LegalContent sections={sections} contentsLabel={legal.contents} />
      </SlidePageBody>
    </div>
  );
}
