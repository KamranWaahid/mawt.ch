import { SubpageHero } from "@/components/sections/subpage-hero";
import { ApproachFlowerSequence } from "@/components/sections/approach-flower-sequence";
import { RichText } from "@/components/ui/rich-text";
import { getMethodPage } from "@/lib/sanity.queries";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { readdirSync, statSync } from "fs";
import path from "path";

interface ProcessPageProps {
  params: Promise<{ lang: Locale }>;
}

const approachFrameFolder = "Approach Page";
const approachFirstFrame = "f2af8e2c-8861-4c64-9f4e-4e65fd9eda22.jpg";
const approachLastFrame = "a6001da5-f533-4597-bf7b-a767d2272a5b.jpg";

function getApproachFrameUrls() {
  const folderPath = path.join(process.cwd(), "public", approachFrameFolder);

  try {
    const frames = readdirSync(folderPath)
      .filter((file) => file.toLowerCase().endsWith(".jpg"))
      .map((file) => {
        const stats = statSync(path.join(folderPath, file));
        return {
          file,
          order: stats.birthtimeMs || stats.mtimeMs,
        };
      })
      .sort((a, b) => a.order - b.order || a.file.localeCompare(b.file))
      .map(({ file }) => file);

    const firstIndex = frames.indexOf(approachFirstFrame);
    const lastIndex = frames.indexOf(approachLastFrame);

    if (firstIndex === -1 || lastIndex === -1) return [];

    const sequence =
      firstIndex <= lastIndex
        ? frames.slice(firstIndex, lastIndex + 1)
        : frames.slice(lastIndex, firstIndex + 1).reverse();

    return sequence.map((file) => `/${encodeURIComponent(approachFrameFolder)}/${file}`);
  } catch {
    return [];
  }
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
  const approachFrames = getApproachFrameUrls();

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

      <ApproachFlowerSequence frames={approachFrames} />

      {doc.intro && (
        <section className="pt-8 pb-4 md:pt-10 md:pb-6">
          <div className="max-w-3xl mx-auto">
            <div className="mt-8"><RichText value={doc.intro} /></div>
          </div>
        </section>
      )}

      {doc.steps?.length > 0 && (
        <section className="pb-16 md:pb-24 lg:pb-32">
          <div className="site-container-wide grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doc.steps.map((step: { title: string; body: unknown }, i: number) => (
              <article key={i} className="flex flex-col gap-4 p-10 border border-black/5 bg-white hover:border-black/20 transition-colors">
                <span className="text-[13px] font-normal text-neutral-400 uppercase tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-normal text-black">{step.title}</h2>
                <div className="text-[15px]"><RichText value={step.body} /></div>
              </article>
            ))}
          </div>
        </section>
      )}

      {Array.isArray(doc.differentiators) && doc.differentiators.length > 0 && (
        <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
          <div className="max-w-3xl mx-auto"><RichText value={doc.differentiators} /></div>
        </section>
      )}

      {doc.bottomCtaH2 && (
        <section className="bg-black text-white py-20 md:py-28 lg:py-36 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatedTitle
              as="h2"
              text={doc.bottomCtaH2}
              className="text-3xl-fluid font-medium tracking-tighter leading-[1.1]"
              splitBy="word"
            />
            {doc.bottomCtaBody && <p className="text-base-fluid text-white/70 font-normal leading-relaxed max-w-[52ch] mx-auto">{doc.bottomCtaBody}</p>}
            {doc.bottomCtaLabel && (
              <Link href={`/${lang}/contact`} className="inline-flex items-center gap-2 mt-2 px-8 py-4 bg-[#75DAB4] text-black text-sm font-normal tracking-widest rounded-sm hover:bg-white transition-colors">
                {doc.bottomCtaLabel}
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
