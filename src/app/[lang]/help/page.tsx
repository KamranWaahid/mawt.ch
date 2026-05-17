import { SubpageHero } from "@/components/sections/subpage-hero";
import { HelpSearch } from "@/components/ui/help-search";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

interface HelpPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: HelpPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Help Center" : "Centre d'aide",
    description: lang === "en" 
      ? "Find answers, guides, and support for the MAWT platform."
      : "Trouvez des réponses, des guides et du support pour la plateforme MAWT.",
  };
}

export default async function HelpPage({ params }: HelpPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const initialCategories = [
    { title: dict.help.categories.gettingStarted, count: 12 },
    { title: dict.help.categories.account, count: 8 },
    { title: dict.help.categories.billing, count: 5 },
    { title: dict.help.categories.integrations, count: 15 },
    { title: dict.help.categories.security, count: 10 },
    { title: dict.help.categories.developer, count: 24 },
  ];

  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge={dict.help.badge}
        title={dict.help.headline}
      />
      
      <HelpSearch 
        initialCategories={initialCategories} 
        dict={dict.help}
      />
    </div>
  );
}
