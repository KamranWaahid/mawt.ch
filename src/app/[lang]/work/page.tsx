import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { WorkProjectsSection } from "@/components/ui/work-projects-section";
import { getAllProjects } from "@/lib/sanity.queries";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, itemListLd, SITE_URL } from "@/components/seo/structured-data";
import { HeaderTheme } from "@/components/ui/header-theme";
import { ScrubTitle } from "@/components/ui/scrub-title";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import { ArrowRight, Boxes } from "lucide-react";
import type { Metadata } from "next";
import { CurtainLink } from "@/components/ui/curtain-link";
import { SlidePageBody } from "@/components/ui/slide-page-body";

interface ProjectsPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Case Studies" : "Études de cas",
    description: lang === "en"
      ? "AI, automation and custom software case studies from Geneva: real projects, measured results — hours saved, errors cut, teams unblocked."
      : "Études de cas IA, automatisation et logiciels sur mesure à Genève : des projets réels, des résultats mesurés — heures récupérées, erreurs réduites.",
    alternates: standaloneAlternates("projets", lang),
    openGraph: {
      title: lang === "en" ? "Case Studies | MAWT" : "Études de cas | MAWT",
      description: lang === "en"
        ? "Real AI and automation projects with measured results."
        : "Des projets IA et automatisation réels, aux résultats mesurés.",
      url: `https://mawt.ch/${lang}/${lang === "fr" ? "projets" : "work"}`,
    },
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const hero = dict.work.hero;
  const fetchedProjects = await getAllProjects(lang);

  const projectItems = fetchedProjects
    .filter((p) => p?.title && p?.slug)
    .map((p) => ({
      name: p.title as string,
      url: `${SITE_URL}/${lang}/${lang === "fr" ? "projets" : "work"}/${p.slug}`,
    }));

  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    {
      name: lang === "fr" ? "Projets" : "Work",
      url: `${SITE_URL}${localizedHref("projets", lang)}`,
    },
  ]);
  const catalogLd = itemListLd(
    lang === "fr" ? "Projets MAWT" : "MAWT Work",
    projectItems,
    lang,
  );

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={projectItems.length ? [crumbLd, catalogLd] : [crumbLd]} />

      {/* Hero — mirrors /services: giant lowercase wordmark + grey cross-link */}
      <section className="pb-[10vh] pt-[24vh]">
        <div className="site-container-xwide">
          <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-tight text-white">
            <span className="block">
              {hero.title}{" "}
              <CurtainLink
                href={localizedHref("services", lang)}
                className="text-white/15 transition-colors hover:text-white/40"
              >
                {hero.crossLabel}
              </CurtainLink>
            </span>
            <span className="block">{hero.tagline}</span>
          </h1>
        </div>
      </section>

      <SlidePageBody>
        <WorkProjectsSection projects={fetchedProjects} lang={lang} dict={dict.work} />

        {/* Tonal statement band — keeps the catalogue in one continuous dark world. */}
        <div className="border-y border-white/10 bg-[#1d1d1d] text-white">
          <section className="py-20 md:py-28 lg:py-36">
            <div className="site-container-xwide">
              <DarkPageIcon icon={Boxes} className="mb-8" />
              <ScrubTitle
                text={dict.work.statement}
                className="max-w-[24ch] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.12] tracking-tight text-white"
              />
              <div className="mt-12">
                <CurtainLink
                  href={localizedHref("contact", lang)}
                  className="group flex w-fit items-center gap-2 border border-white/20 px-8 py-4 text-sm font-normal text-white/85 transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  {dict.work.statementCta}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </CurtainLink>
              </div>
            </div>
          </section>
        </div>
      </SlidePageBody>
    </div>
  );
}
