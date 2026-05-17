import { SubpageHero } from "@/components/sections/subpage-hero";
import { BlogFilter } from "@/components/ui/blog-filter";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Insights" : "Insights",
    description: lang === "en" 
      ? "Latest thoughts from the technical execution team."
      : "Dernières réflexions de l'équipe d'exécution technique.",
  };
}

import { getPosts } from "@/lib/sanity.queries";

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const posts = await getPosts();
  
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge={dict.insights.badge}
        title={dict.insights.headline}
      />
      <BlogFilter posts={posts} />
    </div>
  );
}
