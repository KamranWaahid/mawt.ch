import { SubpageHero } from "@/components/sections/subpage-hero";
import { LegalContent } from "@/components/ui/legal-content";
import type { Locale } from "@/i18n-config";
import { getPageContent } from "@/lib/sanity.queries";
import { portableTextToSections } from "@/lib/portable-text-to-sections";
import type { Metadata } from "next";

const PAGE_KEY = "privacy";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const page = await getPageContent(PAGE_KEY, lang);
  return {
    title: page?.seo?.metaTitle || "Privacy Policy | MAWT Solutions",
    description:
      page?.seo?.metaDescription ||
      "Swiss nFADP and GDPR compliant privacy policy detailing how MAWT Solutions collects, uses, and protects data.",
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
  const page = await getPageContent(PAGE_KEY, lang);
  const sections = page?.body ? portableTextToSections(page.body, page.intro) : privacySectionsFallback;

  return (
    <div className="bg-white min-h-screen">
      <SubpageHero
        badge={lang === "fr" ? "Confidentialité" : "Privacy"}
        title={page?.heroH1 || "Transparency and trust at the core of our operations."}
      />
      <LegalContent sections={sections} />
    </div>
  );
}
