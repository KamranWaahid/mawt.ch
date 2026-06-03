import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { ProjectList } from "@/components/ui/project-list";
import { getAllProjects } from "@/lib/sanity.queries";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Metadata } from "next";

interface ProjectsPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Case Studies" : "Études de cas",
    description: lang === "en"
      ? "Proven systems built for high-performance teams."
      : "Systèmes éprouvés conçus pour des équipes performantes.",
    alternates: standaloneAlternates("projets", lang),
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const fetchedProjects = await getAllProjects();

  const defaultProjects = [
    { _id: "1", title: "Redstart Ventures", workType: "Website design and development", industry: "Deep tech VC fund", year: 2025, slug: "redstart-ventures" },
    { _id: "2", title: "Breathr", workType: "Ongoing partnership", industry: "Consumer Tech", year: 2026, slug: "breathr" },
    { _id: "3", title: "Ampcore Inc.", workType: "Ongoing partnership", industry: "Battery Materials", year: 2024, slug: "ampcore-inc" },
    { _id: "4", title: "Join Valley", workType: "Website design and development", industry: "AI SAAS", year: 2025, slug: "join-valley" },
    { _id: "5", title: "JK Urbanscapes", workType: "Brand system", industry: "Real Estate", year: 2026, slug: "jk-urbanscapes" },
    { _id: "6", title: "Hippocampus Logistic", workType: "Brand system and Landing Page", industry: "Logistic", year: 2025, slug: "hippocampus-logistic" },
    { _id: "7", title: "Wallo", workType: "Website design and brand system", industry: "Ed-Tech", year: 2025, slug: "wallo" },
    { _id: "8", title: "Dime", workType: "Website design", industry: "Fin-Tech", year: 2026, slug: "dime" },
    { _id: "9", title: "SquadStack", workType: "Pitch deck design series C", industry: "Voice AI", year: 2025, slug: "squadstack" },
    { _id: "10", title: "Studio34", workType: "Brand System", industry: "Pilate Studio", year: 2025, slug: "studio34" },
    { _id: "11", title: "Blaiz", workType: "Website design and development", industry: "AI SAAS", year: 2026, slug: "blaiz" }
  ];

  const activeProjects = fetchedProjects.length > 0 ? fetchedProjects : defaultProjects;
  
  return (
    <div className="bg-white min-h-screen pb-24">
      <SubpageHero 
        badge="Case Studies"
        title="Real Projects. Real Results."
      />
      <section className="px-6 sm:px-8 md:px-10 lg:px-12 max-w-[1440px] mx-auto pt-16">
        <div className="max-w-2xl mb-16 flex flex-col gap-4">
           <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Areas of Impact</h3>
           <div className="flex flex-wrap gap-3">
              {["E-Commerce", "Real Estate", "Service Businesses", "Hospitality", "Brand Platforms", "Operational Automation"].map((area, i) => (
                 <span key={i} className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">{area}</span>
              ))}
           </div>
        </div>
        <ProjectList projects={activeProjects} lang={lang} />
      </section>
    </div>
  );
}
