import { SubpageHero } from "@/components/sections/subpage-hero";
import { FlatGrid } from "@/components/ui/flat-grid";
import { ComplianceMatrix } from "@/components/ui/compliance-matrix";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  return {
    title: "Enterprise | MAWT Solutions",
    description: "Solutions for complex organizations. Modernize digital infrastructure, improve operational efficiency, and create scalable systems.",
  };
}

const complianceItems = [
  {
    title: "nFADP (Swiss Law)",
    status: "Compliant",
    description: "Full compliance with the Swiss New Federal Act on Data Protection, ensuring transparent data handling."
  },
  {
    title: "GDPR",
    status: "Compliant",
    description: "Full compliance with the General Data Protection Regulation, ensuring the highest standards of data privacy."
  },
  {
    title: "SOC 2 Type II",
    status: "Compliant",
    description: "Independent audit confirming our security, availability, and confidentiality controls meet rigorous industry standards."
  },
  {
    title: "ISO 27001",
    status: "Certified",
    description: "International standard for information security management systems, confirming our systematic approach."
  }
];

const enterpriseCapabilities = [
  {
    title: "Advanced Integrations",
    description: "Connect complex legacy systems, custom microservices, and proprietary tools into one unified operational workflow."
  },
  {
    title: "Internal Platforms",
    description: "Custom back-office applications, employee portals, and management tools designed for enterprise-scale operations."
  },
  {
    title: "Automation Systems",
    description: "Intelligent workflows and AI-assisted processes that eliminate administrative bottlenecks and accelerate execution."
  },
  {
    title: "Multi-User Dashboards",
    description: "Granular access controls, custom reporting views, and role-based permissions designed for complex organizational oversight."
  },
  {
    title: "Scalable Infrastructure",
    description: "Cloud architecture built to handle millions of requests and petabytes of data without compromising on speed or reliability."
  },
  {
    title: "Long-Term Technical Support",
    description: "Dedicated success managers, continuous monitoring, and around-the-clock technical support with guaranteed SLAs."
  }
];

export default async function EnterprisePage({ params }: { params: Promise<{ lang: Locale }> }) {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="MAWT for Enterprise"
        title="Solutions for complex organizations looking to modernize digital infrastructure."
      />
      <FlatGrid items={enterpriseCapabilities} columns={3} />
      <ComplianceMatrix items={complianceItems} />
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto text-center flex flex-col gap-6 max-w-3xl">
          <h2 className="text-3xl font-normal tracking-tight text-black">Strategic Collaboration</h2>
          <p className="text-lg leading-relaxed text-neutral-500 font-normal mb-8">
            We work closely with internal teams, stakeholders, and decision-makers to deliver reliable, secure, and future-ready solutions designed for long-term impact.
          </p>
          <button className="px-8 py-3.5 bg-black text-white text-sm font-medium hover:bg-brand-teal transition-colors rounded-full w-fit mx-auto">
            Request Enterprise Advisory
          </button>
        </div>
      </section>
    </div>
  );
}
