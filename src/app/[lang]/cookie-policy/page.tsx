import { SubpageHero } from "@/components/sections/subpage-hero";
import { LegalContent } from "@/components/ui/legal-content";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  return {
    title: "Cookie Policy | MAWT Solutions",
    description: "Information regarding cookie transparency, tracking tools, and user consent management for MAWT Solutions.",
  };
}

const cookieSections = [
  {
    title: "1. Cookie Transparency",
    content: [
      "Switzerland expects clear cookie transparency and proper consent handling, especially for analytics and advertising cookies.",
      "We use cookies and similar tracking technologies to track activity on our digital systems and hold certain operational information.",
      "MAWT designs digital systems with privacy, transparency, and operational security integrated from the beginning. We do not use manipulative cookie banners or dark patterns."
    ]
  },
  {
    title: "2. Necessary Cookies",
    content: [
      "These cookies are required for fundamental platform functionality.",
      "They handle secure authentication, user session maintenance, language preferences, and essential security features.",
      "These cookies cannot be disabled as the platform cannot function securely without them."
    ]
  },
  {
    title: "3. Analytics Cookies",
    content: [
      "We utilize analytics tools (such as Google Analytics, Hotjar, and Microsoft Clarity) to understand how users interact with our digital infrastructure.",
      "This data is aggregated and anonymized, helping us identify bottlenecks, optimize page performance, and improve the overall user experience."
    ]
  },
  {
    title: "4. Marketing & Tracking Cookies",
    content: [
      "Where applicable, we may use marketing pixels (such as the Meta Pixel or LinkedIn Insight Tag) to measure the effectiveness of our campaigns and provide relevant professional updates.",
      "Users have full control over whether these tracking mechanisms are active."
    ]
  },
  {
    title: "5. User Controls & Consent Management",
    content: [
      "Users must be able to accept, reject, customize, and revoke consent easily at any time.",
      "You can manage your cookie preferences directly through our consent management interface or by configuring your browser settings to refuse specific categories of cookies."
    ]
  }
];

export default async function CookiePolicyPage({ params }: { params: Promise<{ lang: Locale }> }) {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="Cookie Policy"
        title="Clear transparency regarding tracking and consent."
      />
      <LegalContent sections={cookieSections} />
    </div>
  );
}
