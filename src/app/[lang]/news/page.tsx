import { SubpageHero } from "@/components/sections/subpage-hero";
import { BlogFilter } from "@/components/ui/blog-filter";
import { getDictionary } from "@/get-dictionary";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, itemListLd, SITE_URL } from "@/components/seo/structured-data";
import { getPosts } from "@/lib/sanity.queries";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "en" ? "Insights — AI & automation blog" : "Blog — IA et automatisation en entreprise";
  const description = lang === "en"
    ? "Field notes on AI in business, process automation and custom software, written by the Geneva team that designs and ships these systems."
    : "Retours de terrain sur l'IA en entreprise, l'automatisation et les outils sur mesure, écrits par l'équipe genevoise qui les construit.";
  return {
    title,
    description,
    alternates: standaloneAlternates("blog", lang),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${localizedHref("blog", lang)}`,
      locale: lang === "fr" ? "fr_CH" : "en_US",
    },
    twitter: { title, description },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const posts = await getPosts(lang);

  // JSON-LD: breadcrumb + ItemList of the posts (SSR — AI crawlers skip JS).
  const pageUrl = `${SITE_URL}${localizedHref("blog", lang)}`;
  const pageName = lang === "fr" ? "Blog" : "Insights";
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: pageName, url: pageUrl },
  ]);
  const listLd = itemListLd(
    pageName,
    (posts || [])
      .filter((p) => p?.title && p?.slug)
      .map((p) => ({
        name: p.title,
        url: `${SITE_URL}${localizedHref("blog", lang)}/${p.slug}`,
      })),
    lang,
  );

  return (
    <div className="min-h-screen">
      <JsonLd data={[crumbLd, listLd]} />
      <SubpageHero
        eyebrow={dict.insights.badge}
        title={dict.insights.headline}
        subtitle={lang === "fr" ? "Notes de terrain sur l'IA." : "Field notes on AI in business."}
      />
      <BlogFilter posts={posts} />
    </div>
  );
}
