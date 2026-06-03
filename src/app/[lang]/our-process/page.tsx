import { SubpageHero } from "@/components/sections/subpage-hero";
import { getDictionary } from "@/get-dictionary";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

interface ProcessPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: ProcessPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Notre méthode | MAWT" : "Our Process | MAWT",
    description:
      lang === "fr"
        ? "Notre méthode d'exécution technique, étape par étape, de l'audit au déploiement."
        : "Our technical execution process, step by step, from audit to deployment.",
    alternates: standaloneAlternates("notre-methode", lang),
  };
}

export default async function OurProcessPage({ params }: ProcessPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge={dict.process.badge}
        title={dict.process.headline}
      />
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {dict.process.items.map((step: any) => (
              <div 
                key={step.id} 
                className="flex flex-col gap-6 p-10 border border-black/5 bg-white transition-all duration-500 hover:border-black/20 group"
              >
                <span className="text-[13px] font-normal text-neutral-400 uppercase tracking-widest group-hover:text-black transition-colors">
                  {step.id}
                </span>
                <h3 className="text-xl font-normal text-black">{step.title.replace(" →", "")}</h3>
                <p className="text-[15px] leading-relaxed text-neutral-500 font-normal">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-4xl font-normal tracking-tighter text-black mb-8">
            {lang === "en" ? "Designed for velocity." : "Conçu pour la vélocité."}
          </h2>
          <p className="text-lg text-neutral-500 font-normal leading-relaxed">
            {lang === "en" 
              ? "Our process is built on the principles of speed and precision. We eliminate traditional agency overhead by working as an extension of your team, delivering results in days rather than months."
              : "Notre processus est basé sur les principes de rapidité et de précision. Nous éliminons les frais généraux des agences traditionnelles en travaillant comme une extension de votre équipe."}
          </p>
        </div>
      </section>
    </div>
  );
}
