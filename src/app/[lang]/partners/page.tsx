import { DarkCatalogueHero } from "@/components/ui/dark-catalogue-hero";
import { FlatGrid } from "@/components/ui/flat-grid";
import { PartnerLogoWall } from "@/components/ui/partner-logo-wall";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { SectionReveal } from "@/components/ui/section-reveal";
import { CurtainLink } from "@/components/ui/curtain-link";
import { getDictionary } from "@/get-dictionary";
import { getPartners } from "@/lib/sanity.queries";
import { localizedHref, standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Clients & partners | MAWT" : "Clients & partenaires | MAWT",
    description: lang === "en"
      ? "Organisations and collaborators MAWT works alongside in Geneva and beyond."
      : "Organisations et collaborateurs avec lesquels MAWT travaille à Genève et ailleurs.",
    alternates: standaloneAlternates("clients", lang as Locale),
  };
}

export default async function PartnersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const [dict, partners] = await Promise.all([
    getDictionary(locale),
    getPartners(),
  ]);
  const copy = dict.partners;

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />

      <DarkCatalogueHero
        wordmark={copy.wordmark}
        crossHref={localizedHref("contact", locale)}
        crossLabel={copy.crossLabel}
        title={copy.headline}
      />

      <SlidePageBody>
        <FlatGrid items={copy.tiers} columns={3} />

        <div className="border-t border-white/10">
          <PartnerLogoWall
            partners={partners}
            partnersSuffix={copy.partnersSuffix}
          />
        </div>

        <section className="border-t border-white/10 py-20 md:py-28 lg:py-36">
          <div className="site-container-xwide">
            <SectionReveal>
              <h2 className="max-w-[14ch] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.05] tracking-tight text-white">
                {copy.ctaHeadline}
              </h2>
              <p className="mt-6 max-w-[52ch] text-[15px] font-normal leading-relaxed text-white/55">
                {copy.ctaBody}
              </p>
              <CurtainLink
                href={localizedHref("contact", locale)}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
              >
                {copy.ctaLabel}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <ArrowRight size={13} aria-hidden="true" />
                </span>
              </CurtainLink>
            </SectionReveal>
          </div>
        </section>
      </SlidePageBody>
    </div>
  );
}
