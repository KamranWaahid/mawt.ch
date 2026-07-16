import { getDictionary } from "@/get-dictionary";
import { getHomePageData } from "@/lib/sanity.queries";
import type { Locale } from "@/i18n-config";
import {
  getFamilyTitle,
  familySlugForLang,
  standaloneAlternates,
  localizedHref,
  FAMILY_ORDER,
} from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, itemListLd, SITE_URL } from "@/components/seo/structured-data";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Sparkles,
  Cpu,
  LineChart,
  Database,
  ScanSearch,
  Cloud,
  Boxes,
  Smartphone,
  Radio,
  Blocks,
  Glasses,
  type LucideIcon,
} from "lucide-react";
import { ScrubTitle } from "@/components/ui/scrub-title";
import { HeaderTheme } from "@/components/ui/header-theme";
import { STACK_LOGOS } from "@/content/stack-logos";

// Discreet Lucide glyphs for the domain groups (no official logos exist for
// domains like AI or IoT — a text list with subtle icons stays honest and
// premium). Indexed by [group-1][item]; item order matches both dictionaries.
const DOMAIN_ICONS: LucideIcon[][] = [
  [Brain, Sparkles, Cpu, LineChart, Database, ScanSearch],
  [Cloud, Boxes, Smartphone, Radio, Blocks, Glasses],
];

interface ServicesPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Services — agence IA à Genève" : "Services — AI agency in Geneva",
    description:
      lang === "fr"
        ? "Solutions IA, automatisation, sites, conseil, renfort d'équipe et formation. Ce que MAWT construit pour les PME de Suisse romande."
        : "AI solutions, automation, websites, consulting, team augmentation and training. Everything MAWT builds for SMEs and growing companies across French speaking Switzerland.",
    alternates: standaloneAlternates("services", lang),
    openGraph: {
      title: lang === "fr" ? "Services MAWT" : "MAWT Services",
      description:
        lang === "fr"
          ? "Solutions IA, automatisation, sites, conseil, renfort et formation."
          : "AI solutions, automation, websites, consulting, team augmentation and training.",
      url: `https://mawt.ch/${lang}/services`,
    },
  };
}

type FamilyBlock = {
  key: string;
  title: string;
  description?: string;
  href: string;
  services: { title: string; href: string }[];
};

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  // Pass `lang`: without it this defaulted to EN service docs, so on /fr the
  // service links were built with English slugs (/fr/services/.../website)
  // instead of the French ones (/site-internet) -> 404 across the FR catalog.
  const data = await getHomePageData(lang);
  const hero = dict.services.hero;

  // One block per family, in FAMILY_ORDER; descriptions come from the pillar
  // copy in the dictionaries (same order as FAMILY_ORDER).
  const byFamily = new Map<string, { title: string; href: string }[]>();
  for (const s of (data.services || []).slice().sort((a, b) => (a.tier ?? 50) - (b.tier ?? 50))) {
    if (!s.family || !s.title || !s.slug) continue;
    if (!byFamily.has(s.family)) byFamily.set(s.family, []);
    byFamily.get(s.family)!.push({
      title: s.title,
      href: `/${lang}/services/${familySlugForLang(s.family, lang)}/${s.slug}`,
    });
  }
  const familyBlocks: FamilyBlock[] = FAMILY_ORDER.filter((f) => byFamily.has(f)).map(
    (family, i) => ({
      key: family,
      title: getFamilyTitle(family, lang),
      description: dict.services.pillars?.[i]?.description,
      href: `/${lang}/services/${familySlugForLang(family, lang)}`,
      services: byFamily.get(family)!,
    }),
  );

  const catalogItems = (data.services || [])
    .filter((s) => s?.family && s?.title && s?.slug)
    .map((s) => ({
      name: s.title as string,
      url: `${SITE_URL}/${lang}/services/${familySlugForLang(s.family as string, lang)}/${s.slug}`,
    }));
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: "Services", url: `${SITE_URL}${localizedHref("services", lang)}` },
  ]);
  const catalogLd = itemListLd(
    lang === "fr" ? "Services MAWT" : "MAWT Services",
    catalogItems,
    lang,
  );

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={catalogItems.length ? [crumbLd, catalogLd] : [crumbLd]} />

      {/* Hero — giant lowercase wordmark + tagline, with the greyed cross-link
          to the sibling section, mirroring the services/industries pairing. */}
      <section className="pb-[10vh] pt-[24vh]">
        <div className="site-container-xwide">
          <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-tight text-white">
            <span className="block">
              {hero.title}{" "}
              <Link
                href={localizedHref("projets", lang)}
                className="text-white/15 transition-colors hover:text-white/40"
              >
                {hero.crossLabel}
              </Link>
            </span>
            <span className="block">{hero.tagline}</span>
          </h1>
        </div>
      </section>

      {/* Family blocks — two-column masonry: big title, short pitch, one
          hairline row per service, then a pill to the family page. */}
      <section className="pb-[14vh]">
        <div className="site-container-xwide columns-1 gap-x-20 md:columns-2">
          {familyBlocks.map((block) => (
            <div key={block.key} className="mb-24 break-inside-avoid md:mb-28">
              <h2 className="max-w-[14ch] text-[clamp(1.9rem,3.2vw,3rem)] font-semibold leading-[1.05] tracking-tight text-white">
                {block.title}
              </h2>
              {block.description && (
                <p className="mt-6 max-w-[46ch] text-[15px] font-normal leading-relaxed text-white/55">
                  {block.description}
                </p>
              )}
              <ul className="mt-10">
                {block.services.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="group flex items-center justify-between gap-6 border-b border-white/10 py-[15px] text-[14px] font-normal text-white/75 transition-colors hover:text-white"
                    >
                      {service.title}
                      <ArrowUpRight
                        size={14}
                        className="shrink-0 text-white/0 transition-all duration-300 group-hover:text-white/60"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={block.href}
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white"
              >
                {hero.familyMore}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <ArrowRight size={13} />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Light band — the statement scrubs from grey to black as you scroll
          (site-wide ScrubWord effect), then a methodology link. */}
      <div className="bg-[#F6F5F4] text-black">
        <section className="py-20 md:py-28 lg:py-36">
          <div className="site-container-xwide">
            <ScrubTitle
              text={lang === "en"
                ? "We don't just build tools. We build the systems that run your business."
                : "Nous ne construisons pas seulement des outils. Nous construisons les systèmes qui font tourner votre entreprise."}
              className="max-w-[24ch] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.12] tracking-tight text-neutral-900"
            />
            <div className="mt-12">
              <Link
                href={lang === "en" ? `/${lang}/our-process` : `/${lang}/notre-methode`}
                className="group flex w-fit items-center gap-2 border border-black px-8 py-4 text-sm font-normal text-black transition-all duration-300 hover:bg-black hover:text-white"
              >
                {lang === "en" ? "Explore our methodology" : "Explorer notre méthodologie"}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Technologies — back to the dark ground, content inverted
          (lead-dev requirement, list kept intact). */}
      {dict.services.technologies?.groups?.length ? (
        <div className="bg-[#161616] text-white">
          <section className="py-16 md:py-24 lg:py-28">
            <div className="site-container-xwide">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4 lg:col-start-1">
                  <h2 className="text-2xl-fluid font-medium tracking-tight text-white">
                    {dict.services.technologies.title}
                  </h2>
                  <p className="mt-4 max-w-[38ch] text-sm-fluid font-normal leading-relaxed text-white/55">
                    {dict.services.technologies.intro}
                  </p>
                </div>
                <div className="space-y-14 lg:col-span-8">
                  <div className="space-y-6">
                    <h3 className="text-sm-fluid font-medium text-white/80">
                      {dict.services.technologies.groups[0]?.title}
                    </h3>
                    <ul className="grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-5">
                      {STACK_LOGOS.map((logo) => (
                        <li
                          key={logo.name}
                          className="group flex flex-col items-center gap-2.5 text-center"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-8 w-8 fill-white/40 opacity-70 transition duration-300 group-hover:fill-white group-hover:opacity-100"
                          >
                            <path d={logo.path} />
                          </svg>
                          <span className="text-xs font-normal text-white/50 transition-colors duration-300 group-hover:text-white">
                            {logo.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2">
                    {dict.services.technologies.groups.slice(1).map((group: { title: string; items: string[] }, gIdx: number) => (
                      <div key={group.title} className="space-y-5">
                        <h3 className="text-sm-fluid font-medium text-white/80">{group.title}</h3>
                        <ul className="space-y-3">
                          {group.items.map((item, iIdx) => {
                            const Icon = DOMAIN_ICONS[gIdx]?.[iIdx];
                            return (
                              <li key={item} className="flex items-center gap-3 text-sm-fluid font-normal leading-relaxed text-white/55">
                                {Icon ? (
                                  <Icon size={15} strokeWidth={1.5} className="shrink-0 text-white/40" aria-hidden="true" />
                                ) : null}
                                {item}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
