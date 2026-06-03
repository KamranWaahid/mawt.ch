import { SubpageHero } from "@/components/sections/subpage-hero";
import { ComplianceMatrix } from "@/components/ui/compliance-matrix";
import { FlatGrid } from "@/components/ui/flat-grid";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Sécurité | MAWT Solutions" : "Security | MAWT Solutions",
    description:
      lang === "fr"
        ? "Principes de sécurité, normes de conformité et protection des données chez MAWT Solutions."
        : "Security principles, compliance standards, and data protection infrastructure at MAWT Solutions.",
    alternates: standaloneAlternates("securite", lang),
  };
}

const securityFeatures = [
  {
    title: "Secure Development",
    description: "We follow structured development practices designed to reduce vulnerabilities and improve platform reliability."
  },
  {
    title: "Data Protection",
    description: "We minimize unnecessary data collection and prioritize secure handling of client information under Swiss nFADP and GDPR."
  },
  {
    title: "Infrastructure Reliability",
    description: "We work with trusted technologies, secure hosting environments, and scalable cloud infrastructure."
  },
  {
    title: "Access Control",
    description: "We implement secure authentication practices and role-based permissions where required."
  }
];

const complianceItems = [
  {
    title: "nFADP (Swiss Law)",
    status: "Compliant",
    description: "Full compliance with the Swiss New Federal Act on Data Protection, ensuring transparent data handling."
  },
  {
    title: "GDPR",
    status: "Compliant",
    description: "Full compliance with the General Data Protection Regulation, ensuring the highest standards of data privacy for EU citizens."
  },
  {
    title: "SOC 2 Type II",
    status: "Compliant",
    description: "Independent audit confirming our security, availability, and confidentiality controls meet rigorous industry standards."
  },
  {
    title: "ISO 27001",
    status: "Certified",
    description: "International standard for information security management systems, confirming our systematic approach to managing sensitive company information."
  }
];

export default async function SecurityPage({ params }: { params: Promise<{ lang: Locale }> }) {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="Security First"
        title="Security is integrated into the way we design and build digital systems."
      />
      <FlatGrid items={securityFeatures} columns={2} />
      <ComplianceMatrix items={complianceItems} />
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto max-w-3xl text-center flex flex-col gap-6">
          <h2 className="text-3xl font-normal tracking-tight text-black">Ongoing Improvements</h2>
          <p className="text-lg leading-relaxed text-neutral-500 font-normal">
            Security is not a one-time process. We continuously review technologies, workflows, and integrations to improve system stability and protection.
          </p>
        </div>
      </section>
    </div>
  );
}
