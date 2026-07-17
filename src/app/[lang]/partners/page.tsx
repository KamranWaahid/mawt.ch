import { SubpageHero } from "@/components/sections/subpage-hero";
import { FlatGrid } from "@/components/ui/flat-grid";
import { PartnerLogoWall } from "@/components/ui/partner-logo-wall";
import { getDictionary } from "@/get-dictionary";
import { getPartners } from "@/lib/sanity.queries";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Partners" : "Partenaires",
    description: lang === "en"
      ? "The agencies, platforms and specialists we work with."
      : "Les agences, plateformes et spécialistes avec qui nous travaillons.",
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
      description: "Agencies and consultants who bring MAWT's work into their own client projects."
    },
    {
      title: "Technology Partners",
      description: "Software platforms we build close, lasting integrations with."
    },
    {
      title: "Referral Partners",
      description: "People and businesses who introduce us to their network, and are rewarded when it leads to a project."
    }
  ];

  return (
    <div className="min-h-screen">
      <SubpageHero 
        badge={d.partners?.badge || "Partners"}
        title={d.partners?.headline || "Partner with MAWT."}
      />
      
      <FlatGrid items={partnerTiers} columns={3} />

      <PartnerLogoWall partners={partners} />
      
      <section className="px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="site-container-wide text-center">
          <h2 className="text-3xl font-normal tracking-tight text-black mb-6">Work with us.</h2>
          <p className="text-lg text-neutral-500 font-normal mb-10 max-w-3xl mx-auto">
            We keep our partner network small and choose people who care about the work as much as we do. If that sounds like you, we&apos;d like to talk.
          </p>
          <Link href={`/${lang}/contact`} className="inline-flex px-8 py-3 bg-black text-white text-sm font-normal hover:bg-neutral-800 transition-colors">
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
