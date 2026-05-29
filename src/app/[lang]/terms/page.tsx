import { SubpageHero } from "@/components/sections/subpage-hero";
import { LegalContent } from "@/components/ui/legal-content";
import type { Locale } from "@/i18n-config";
import { getPageContent } from "@/lib/sanity.queries";
import { portableTextToSections } from "@/lib/portable-text-to-sections";
import type { Metadata } from "next";

const PAGE_KEY = "terms";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const page = await getPageContent(PAGE_KEY, lang);
  return {
    title: page?.seo?.metaTitle || "Terms of Service | MAWT Solutions",
    description:
      page?.seo?.metaDescription ||
      "Operational policies, project guidelines, and service terms for working with MAWT Solutions under Swiss governing law.",
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
  const page = await getPageContent(PAGE_KEY, lang);
  const sections = page?.body ? portableTextToSections(page.body, page.intro) : termsSectionsFallback;

  return (
    <div className="bg-white min-h-screen">
      <SubpageHero
        badge={lang === "fr" ? "Conditions" : "Terms"}
        title={page?.heroH1 || "Clear operational guidelines for professional collaboration."}
      />
      <LegalContent sections={sections} />
    </div>
  );
}
