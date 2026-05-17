import { SubpageHero } from "@/components/sections/subpage-hero";
import { LegalContent } from "@/components/ui/legal-content";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  return {
    title: "Privacy Policy | MAWT Solutions",
    description: "Swiss nFADP and GDPR compliant privacy policy detailing how MAWT Solutions collects, uses, and protects data.",
  };
}

const privacySections = [
  {
    title: "1. Privacy Commitment",
    content: [
      "We respect the privacy of our clients and users.",
      "We do not sell personal data or use information irresponsibly.",
      "Any information shared with MAWT is handled with care and used only for legitimate operational, communication, or project-related purposes.",
      "MAWT designs digital systems with privacy, transparency, and operational security integrated from the beginning, not added afterward. We prioritize lean infrastructure, controlled data access, and responsible integrations to reduce unnecessary exposure and operational complexity."
    ]
  },
  {
    title: "2. Data Collection & Processing",
    content: [
      "This Privacy Policy outlines how MAWT complies with the Swiss New Federal Act on Data Protection (nFADP) and the General Data Protection Regulation (GDPR) for our EU users.",
      "We collect specific categories of data, including contact information, project details, and technical usage data.",
      "Information may be used to:",
      "• improve services,",
      "• manage projects,",
      "• communicate updates,",
      "• and optimize user experience.",
      "We aim to collect only the information that is genuinely necessary."
    ]
  },
  {
    title: "3. Transparency & Control (Your Rights)",
    content: [
      "We believe users should understand how their information is used and have control over it.",
      "Depending on applicable regulations, users may request:",
      "• access to their data,",
      "• corrections,",
      "• deletion requests,",
      "• or clarification regarding stored information."
    ]
  },
  {
    title: "4. Third-Party Processors & International Transfers",
    content: [
      "We utilize trusted third-party services to operate efficiently, including analytics and hosting providers (e.g., Vercel, Supabase, Google Analytics).",
      "We ensure that all international data transfers comply with Swiss data protection standards and that our providers maintain rigorous security protocols."
    ]
  },
  {
    title: "5. Responsible Handling",
    content: [
      "We prioritize:",
      "• limited data collection,",
      "• secure storage,",
      "• and responsible usage practices.",
      "Privacy should be built into systems, not added afterward."
    ]
  }
];

export default async function LegalPage({ params }: { params: Promise<{ lang: Locale }> }) {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="Privacy Policy"
        title="Transparency and trust at the core of our operations."
      />
      <LegalContent sections={privacySections} />
    </div>
  );
}
