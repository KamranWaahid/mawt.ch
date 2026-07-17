import { BlogFilter } from "@/components/ui/blog-filter";
import { getDictionary } from "@/get-dictionary";
import { getPosts } from "@/lib/sanity.queries";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, itemListLd, SITE_URL } from "@/components/seo/structured-data";
import { HeaderTheme } from "@/components/ui/header-theme";
import { ScrubTitle } from "@/components/ui/scrub-title";
import { CurtainLink } from "@/components/ui/curtain-link";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import type { Locale } from "@/i18n-config";
import { ArrowRight, Newspaper } from "lucide-react";
import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Insights — AI & automation blog" : "Blog — IA et automatisation en entreprise",
    description: lang === "en"
      ? "Field notes on AI in business, automation and custom tools, written by the team that builds them."
      : "Retours de terrain sur l'IA en entreprise, l'automatisation et les outils sur mesure, écrits par l'équipe qui les construit.",
    alternates: standaloneAlternates("blog", lang),
    openGraph: {
      title: lang === "en" ? "Insights | MAWT" : "Actualités | MAWT",
      description: lang === "en"
        ? "Field notes on AI in business, automation and custom tools."
        : "Retours de terrain sur l'IA en entreprise, l'automatisation et les outils sur mesure.",
      url: `https://mawt.ch/${lang}/${lang === "fr" ? "blog" : "news"}`,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const hero = dict.insights.hero;
  const posts = await getPosts(lang);

  const postItems = posts
    .filter((p) => p?.title && p?.slug)
    .map((p) => ({
      name: p.title,
      url: `${SITE_URL}/${lang}/${lang === "fr" ? "blog" : "news"}/${p.slug}`,
    }));

  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    {
      name: lang === "fr" ? "Actualités" : "News",
      url: `${SITE_URL}${localizedHref("blog", lang)}`,
    },
  ]);
  const catalogLd = itemListLd(
    lang === "fr" ? "Actualités MAWT" : "MAWT Insights",
    postItems,
    lang,
  );

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={postItems.length ? [crumbLd, catalogLd] : [crumbLd]} />

      {/* Hero — same scale and structure as /services and /work */}
      <section className="pb-[10vh] pt-[24vh]">
        <div className="site-container-xwide">
          <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-tight text-white">
            <span className="block">
              {hero.title}{" "}
              <CurtainLink
                href={localizedHref("projets", lang)}
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
        <BlogFilter posts={posts} dict={dict.insights} lang={lang} />

        <div className="border-y border-white/10 bg-[#1d1d1d] text-white">
          <section className="py-20 md:py-28 lg:py-36">
            <div className="site-container-xwide">
              <DarkPageIcon icon={Newspaper} className="mb-8" />
              <ScrubTitle
                text={dict.insights.statement}
                className="max-w-[24ch] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.12] tracking-tight text-white"
              />
              <div className="mt-12">
                <CurtainLink
                  href={localizedHref("contact", lang)}
                  className="group flex w-fit items-center gap-2 border border-white/20 px-8 py-4 text-sm font-normal text-white/85 transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  {dict.insights.statementCta}
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
