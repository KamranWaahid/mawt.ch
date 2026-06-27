import { SubpageHero } from "@/components/sections/subpage-hero";
import { FlatGrid } from "@/components/ui/flat-grid";
import { PartnerLogoWall } from "@/components/ui/partner-logo-wall";
import { getDictionary } from "@/get-dictionary";
import { getPartners } from "@/lib/sanity.queries";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Partners | MAWT Network" : "Partenaires | Réseau MAWT",
    description: lang === "en"
      ? "Our ecosystem of technical and strategic partners."
      : "Notre écosystème de partenaires techniques et stratégiques.",
    alternates: standaloneAlternates("clients", lang as Locale),
  };
}

export default async function PartnersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const [dict, partners] = await Promise.all([
    getDictionary(lang as Locale),
    getPartners()
  ]);
  const d = dict as any;

  const partnerTiers = [
    {
      title: "Solution Partners",
      description: "Agencies and consultancies that integrate MAWT technology into their clients' operational workflows."
    },
    {
      title: "Technology Partners",
      description: "Software platforms that build deep integrations with the MAWT execution engine and infrastructure."
    },
    {
      title: "Referral Partners",
      description: "Individuals and businesses that recommend MAWT to their network and earn rewards for successful executions."
    }
  ];

  return (
    <div className="min-h-screen">
      <SubpageHero 
        badge={d.partners?.badge || "Partner Programs"}
        title={d.partners?.headline || "Scale your impact through the MAWT partner ecosystem."}
      />
      
      <FlatGrid items={partnerTiers} columns={3} />

      <PartnerLogoWall partners={partners} />
      
      <section className="px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="site-container-wide text-center">
          <h2 className="text-3xl font-normal tracking-tight text-black mb-6">Partner with the best.</h2>
          <p className="text-lg text-neutral-500 font-normal mb-10 max-w-3xl mx-auto">
            We work with a select group of partners who share our commitment to technical excellence and operational speed. Join our program to access exclusive resources, training, and support.
          </p>
          <button className="px-8 py-3 bg-black text-white text-sm font-normal hover:bg-neutral-800 transition-colors">
            Apply to Program
          </button>
        </div>
      </section>
    </div>
  );
}
