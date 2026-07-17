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

const PAGE_KEY = "cookies";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const page = await getPageContent(PAGE_KEY, lang);
  return {
    title: page?.seo?.metaTitle || (lang === "fr" ? "Cookies | MAWT" : "Cookie Policy | MAWT Solutions"),
    description:
      page?.seo?.metaDescription ||
      "Information regarding cookie transparency, tracking tools, and user consent management for MAWT Solutions.",
    alternates: standaloneAlternates("cookies", lang),
  };
}

const cookieSectionsFallback = [
  {
    title: "1. Cookie Transparency",
    content: [
      "We use cookies and similar tracking technologies to track activity on our digital systems and hold certain operational information.",
    ],
  },
];

export default async function CookiesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const [page, dict] = await Promise.all([
    getPageContent(PAGE_KEY, lang),
    getDictionary(lang),
  ]);
  const sections = page?.body ? portableTextToSections(page.body, page.intro) : cookieSectionsFallback;
  const legal = dict.legalPages;

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <DarkCatalogueHero
        wordmark={legal.cookiesWordmark}
        crossHref={localizedHref("contact", lang)}
        crossLabel={legal.crossLabel}
        title={page?.heroH1 || "Clear transparency regarding tracking and consent."}
      />
      <SlidePageBody>
        <LegalContent sections={sections} contentsLabel={legal.contents} />
      </SlidePageBody>
    </div>
  );
}
