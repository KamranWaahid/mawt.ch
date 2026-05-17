import { SubpageHero } from "@/components/sections/subpage-hero";
import { CountUp } from "@/components/ui/count-up";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

interface ResultsPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: ResultsPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Results" : "Résultats",
    description: lang === "en" 
      ? "Measurable impact on operational efficiency and scale."
      : "Impact mesurable sur l'efficacité opérationnelle et l'échelle.",
  };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge={dict.results.badge}
        title={dict.results.headline}
      />
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {dict.results.metrics.map((metric: any) => (
              <div key={metric.label} className="flex flex-col gap-6 p-12 border border-black/5 bg-neutral-50/30 text-center hover:bg-neutral-50 transition-colors duration-500">
                <span className="text-[13px] font-normal text-neutral-400 uppercase tracking-widest">{metric.label}</span>
                <span className="text-7xl font-normal text-black tracking-tighter">
                  <CountUp value={metric.value} />
                </span>
                <p className="text-[15px] text-neutral-500 font-normal leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-4xl font-normal tracking-tighter text-black mb-8">{dict.results.footerHeadline}</h2>
          <p className="text-lg text-neutral-500 font-normal leading-relaxed">
            {dict.results.footerDesc}
          </p>
        </div>
      </section>
    </div>
  );
}
