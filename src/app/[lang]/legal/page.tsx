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

const PAGE_KEY = "privacy";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const page = await getPageContent(PAGE_KEY, lang);
  return {
    title: page?.seo?.metaTitle || (lang === "fr" ? "Politique de confidentialité | MAWT Solutions" : "Privacy Policy | MAWT Solutions"),
    description:
      page?.seo?.metaDescription ||
      "Swiss nFADP and GDPR compliant privacy policy detailing how MAWT Solutions collects, uses, and protects data.",
    alternates: standaloneAlternates("confidentialite", lang),
  };
}

const privacySectionsFallback = [
  {
    title: "1. Privacy Commitment",
    content: [
      "We respect the privacy of our clients and users.",
      "We do not sell personal data or use information irresponsibly.",
      "Any information shared with MAWT is handled with care and used only for legitimate operational, communication, or project-related purposes.",
      "MAWT designs digital systems with privacy, transparency, and operational security integrated from the beginning, not added afterward. We prioritize lean infrastructure, controlled data access, and responsible integrations to reduce unnecessary exposure and operational complexity.",
    ],
  },
];

export default async function LegalPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const [page, dict] = await Promise.all([
    getPageContent(PAGE_KEY, lang),
    getDictionary(lang),
  ]);
  const sections = page?.body ? portableTextToSections(page.body, page.intro) : privacySectionsFallback;
  const legal = dict.legalPages;

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <DarkCatalogueHero
        wordmark={legal.privacyWordmark}
        crossHref={localizedHref("contact", lang)}
        crossLabel={legal.crossLabel}
        title={page?.heroH1 || "How we handle personal data."}
      />
      <SlidePageBody>
        <LegalContent sections={sections} contentsLabel={legal.contents} />
      </SlidePageBody>
    </div>
  );
}
