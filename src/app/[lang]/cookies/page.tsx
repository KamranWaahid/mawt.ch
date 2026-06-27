import { SubpageHero } from "@/components/sections/subpage-hero";
import { LegalContent } from "@/components/ui/legal-content";
import type { Locale } from "@/i18n-config";
import { getPageContent } from "@/lib/sanity.queries";
import { portableTextToSections } from "@/lib/portable-text-to-sections";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
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
  const page = await getPageContent(PAGE_KEY, lang);
  const sections = page?.body ? portableTextToSections(page.body, page.intro) : cookieSectionsFallback;

  return (
    <div className="min-h-screen">
      <SubpageHero
        badge={lang === "fr" ? "Cookies" : "Cookie Policy"}
        title={page?.heroH1 || "Clear transparency regarding tracking and consent."}
      />
      <LegalContent sections={sections} />
    </div>
  );
}
