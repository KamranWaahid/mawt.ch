import { brandSafeTitle } from "@/lib/seo-meta";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { LegalContent } from "@/components/ui/legal-content";
import type { Locale } from "@/i18n-config";
import { getPageContent } from "@/lib/sanity.queries";
import { portableTextToSections } from "@/lib/portable-text-to-sections";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Metadata } from "next";

const PAGE_KEY = "legal-notice";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const page = await getPageContent(PAGE_KEY, lang);
  return {
    title: brandSafeTitle(
      page?.seo?.metaTitle ||
        (lang === "fr" ? "Mentions légales | MAWT" : "Legal Notice | MAWT"),
    ),
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
  const page = await getPageContent(PAGE_KEY, lang);
  const sections = page?.body ? portableTextToSections(page.body, page.intro) : fallbackSections;

  return (
    <div className="min-h-screen">
      <SubpageHero
        badge={lang === "fr" ? "Mentions légales" : "Legal Notice"}
        title={page?.heroH1 || (lang === "fr" ? "Mentions légales" : "Legal Notice")}
      />
      <LegalContent sections={sections} />
    </div>
  );
}
