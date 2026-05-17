import { SubpageHero } from "@/components/sections/subpage-hero";
import { LegalContent } from "@/components/ui/legal-content";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  return {
    title: "Terms of Service | MAWT Solutions",
    description: "Operational policies, project guidelines, and service terms for working with MAWT Solutions under Swiss governing law.",
  };
}

const termsSections = [
  {
    title: "1. Agreement to Terms",
    content: [
      "By using MAWT services, you agree to our operational policies, project guidelines, and service terms.",
      "Our terms are designed to ensure:",
      "• transparent collaboration,",
      "• clear deliverables,",
      "• fair usage,",
      "• and professional conduct for all parties."
    ]
  },
  {
    title: "2. Project Scope & Deliverables",
    content: [
      "All projects begin with a clearly defined strategy and scope of work. Any modifications or additions outside the agreed deliverables will be subject to separate estimation and approval.",
      "We adhere to structured development phases, ensuring regular updates and transparent progress tracking."
    ]
  },
  {
    title: "3. Intellectual Property Ownership",
    content: [
      "Upon full and final payment of all outstanding invoices, full intellectual property ownership of the custom deliverables transfers to the client.",
      "MAWT retains the right to use completed project imagery and descriptions within our case studies, portfolio, and marketing materials unless a specific non-disclosure agreement (NDA) is active.",
      "Third-party software, open-source libraries, and existing proprietary tools utilized within the project remain subject to their original licensing terms."
    ]
  },
  {
    title: "4. Payment Terms & Revisions",
    content: [
      "Invoices are issued according to the agreed project milestones. Payment terms are strictly net 14 days unless otherwise specified in the project contract.",
      "We include structured revision cycles within each project phase to ensure alignment before final deployment."
    ]
  },
  {
    title: "5. Limitation of Liability & Third-Party Services",
    content: [
      "MAWT builds robust digital infrastructure but cannot be held liable for disruptions caused by third-party software updates, hosting provider outages, or external API modifications.",
      "Ongoing maintenance, support, and hosting management are provided under separate service level agreements (SLAs)."
    ]
  },
  {
    title: "6. Governing Law & Jurisdiction",
    content: [
      "These Terms of Service are governed by and construed in accordance with the laws of Switzerland.",
      "Any disputes arising from or related to these terms or our services shall be subject to the exclusive jurisdiction of the competent courts of Geneva, Switzerland."
    ]
  }
];

export default async function TermsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="Terms of Service"
        title="Clear operational guidelines for professional collaboration."
      />
      <LegalContent sections={termsSections} />
    </div>
  );
}
