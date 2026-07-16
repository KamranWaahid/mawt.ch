import { SubpageHero } from "@/components/sections/subpage-hero";
import { BlogFilter } from "@/components/ui/blog-filter";
import { getDictionary } from "@/get-dictionary";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
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
  };
}

import { getPosts } from "@/lib/sanity.queries";

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const posts = await getPosts(lang);
  
  return (
    <div className="min-h-screen">
      <SubpageHero 
        eyebrow={dict.insights.badge}
        title={dict.insights.headline}
        subtitle={lang === "fr" ? "Notes de terrain sur l'IA." : "Field notes on AI in business."}
      />
      <BlogFilter posts={posts} />
    </div>
  );
}
