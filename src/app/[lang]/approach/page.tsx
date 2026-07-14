import { SubpageHero } from "@/components/sections/subpage-hero";
import { ApproachStickySteps } from "@/components/sections/approach-sticky-steps";
import { RichText } from "@/components/ui/rich-text";
import { getMethodPage } from "@/lib/sanity.queries";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedTitle } from "@/components/ui/animated-title";

interface ProcessPageProps {
  params: Promise<{ lang: Locale }>;
}

type PortableTextBlock = {
  _type?: string;
  children?: Array<{ text?: string }>;
};

function portableTextToPlainText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((block: PortableTextBlock) => {
      if (block?._type !== "block" || !Array.isArray(block.children)) return "";
      return block.children.map((child) => child.text || "").join("");
    })
    .filter(Boolean)
    .join(" ");
}

export async function generateMetadata({ params }: ProcessPageProps): Promise<Metadata> {
  const { lang } = await params;
  const doc = await getMethodPage(lang);
  return {
    title: doc?.seo?.metaTitle || (lang === "fr" ? "Notre méthode | MAWT" : "Our Process | MAWT"),
    description:
      doc?.seo?.metaDescription ||
      (lang === "fr"
        ? "Comment MAWT mène un projet IA, du cadrage au déploiement, étape par étape."
        : "How MAWT runs an AI project, from scoping to deployment, step by step."),
    alternates: standaloneAlternates("notre-methode", lang),
  };
}

export default async function OurProcessPage({ params }: ProcessPageProps) {
  const { lang } = await params;
  const doc = await getMethodPage(lang);
  const badge = lang === "fr" ? "Notre méthode" : "Our process";

  if (!doc?.heroH1) {
    return (
      <div className="min-h-screen">
        <SubpageHero
          eyebrow={badge}
          title={lang === "fr" ? "Bientôt disponible." : "Coming soon."}
        />
        <section className="px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
          <p className="text-neutral-500 font-normal italic">
            {lang === "fr" ? "Cette page sera bientôt disponible." : "This page will be available soon."}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SubpageHero
        eyebrow={badge}
        title={doc.heroH1}
        subtitle={doc.heroH2 || (lang === "fr" ? "Structuré, transparent, livrable." : "Structured, transparent, deliverable.")}
      />
      {doc.intro && (
        <section className="pt-8 pb-4 md:pt-10 md:pb-6">
          <div className="site-container max-w-3xl mx-auto">
            <div className="mt-8"><RichText value={doc.intro} /></div>
          </div>
        </section>
      )}

      {doc.steps?.length > 0 && (
        <ApproachStickySteps
          steps={doc.steps.map((step: { title: string; body: unknown }, i: number) => ({
            id: String(i + 1).padStart(2, "0"),
            title: step.title,
            body: portableTextToPlainText(step.body),
          }))}
        />
      )}

      {Array.isArray(doc.differentiators) && doc.differentiators.length > 0 && (
        <section className="relative z-10 -mt-[1px] bg-[#F6F5F4] py-16 md:py-24 lg:py-32 border-t border-black/5">
          <div className="site-container max-w-3xl mx-auto">
            <RichText value={doc.differentiators} />
          </div>
        </section>
      )}
    </div>
  );
}
