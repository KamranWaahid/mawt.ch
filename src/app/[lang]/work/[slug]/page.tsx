import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { SectionReveal } from "@/components/ui/section-reveal";
import { getProjectBySlug } from "@/lib/sanity.queries";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { CurtainLink } from "@/components/ui/curtain-link";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { urlForImage } from "@/lib/sanity.image";
import { hreflangAlternates } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, SITE_URL, ORG_ID } from "@/components/seo/structured-data";
import type { Locale } from "@/i18n-config";

type ProjectPageProps = {
  params: Promise<{ slug: string; lang: Locale }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const imageUrl = project.coverImage
    ? urlForImage(project.coverImage)?.width(1200).height(630).url()
    : null;

  return {
    // No "| MAWT" here: the layout title template appends the brand suffix.
    title: `${project.title} | ${lang === "fr" ? "projet" : "case study"}`,
    description: project.excerpt,
    // Canonical + hreflang: FR/EN twins share the slug, only the section
    // segment differs (/fr/projets vs /en/work) — translatePath handles it.
    alternates: hreflangAlternates(
      `/${lang}/${lang === "fr" ? "projets" : "work"}/${slug}`,
      lang,
    ),
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: project.coverImage?.alt ?? `${project.title} case study`,
            },
          ]
        : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, lang } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const heroImage = project.coverImage
    ? urlForImage(project.coverImage)?.width(2400).height(1200).url()
    : null;
  const problemImage = project.problemImage
    ? urlForImage(project.problemImage)?.width(1600).url()
    : null;
  const solutionImage = project.solutionImage
    ? urlForImage(project.solutionImage)?.width(1600).url()
    : null;
  const galleryImages =
    project.gallery
      ?.map((image, idx) => {
        const src = urlForImage(image)?.width(1600).url();

        return src ? { image, idx, src } : null;
      })
      .filter(
        (item): item is { image: NonNullable<typeof project.gallery>[number]; idx: number; src: string } =>
          Boolean(item),
      ) ?? [];

  // JSON-LD: case studies are the agency's #1 "Experience" (E-E-A-T) proof —
  // Article + breadcrumb, cross-referenced to the global Organization.
  const canonical = `${SITE_URL}/${lang}/${lang === "fr" ? "projets" : "work"}/${slug}`;
  const listingUrl = `${SITE_URL}/${lang}/${lang === "fr" ? "projets" : "work"}`;
  const ogImage = project.coverImage
    ? urlForImage(project.coverImage)?.width(1200).height(630).url()
    : null;
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: lang === "fr" ? "Études de cas" : "Case studies", url: listingUrl },
    { name: project.title, url: canonical },
  ]);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    url: canonical,
    headline: project.title,
    ...(project.excerpt ? { description: project.excerpt } : {}),
    ...(ogImage ? { image: ogImage } : {}),
    inLanguage: lang === "fr" ? "fr-CH" : "en",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(project._createdAt ? { datePublished: project._createdAt } : {}),
    ...(project._updatedAt ? { dateModified: project._updatedAt } : {}),
  };

  return (
    <div className="min-h-screen w-full bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={[crumbLd, articleLd]} />

      <div className="site-container-xwide grid grid-cols-1 items-start gap-8 pb-12 pt-32 md:gap-12 md:pb-16 md:pt-40 lg:grid-cols-[7fr_3fr]">
        <div className="space-y-4 lg:space-y-6">
          <SectionReveal className="relative w-full overflow-hidden border border-white/10 bg-white/[0.03]">
            {heroImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroImage}
                alt={project.coverImage?.alt ?? project.title}
                className="h-auto w-full object-contain"
              />
            ) : null}
          </SectionReveal>

          {problemImage && (
            <SectionReveal className="relative w-full overflow-hidden border border-white/10 bg-white/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={problemImage}
                alt="Problem visualization"
                className="h-auto w-full object-contain"
              />
            </SectionReveal>
          )}

          {solutionImage && (
            <SectionReveal className="relative w-full overflow-hidden border border-white/10 bg-white/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={solutionImage}
                alt="Solution visualization"
                className="h-auto w-full object-contain"
              />
            </SectionReveal>
          )}

          {galleryImages.length > 0 && (
            <>
              {galleryImages.map(({ image, idx, src }) => (
                <SectionReveal
                  key={idx}
                  className="relative w-full overflow-hidden border border-white/10 bg-white/[0.03]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={image.alt || `Gallery image ${idx}`}
                    className="h-auto w-full object-contain"
                  />
                </SectionReveal>
              ))}
            </>
          )}
        </div>

        <div
          className="flex flex-col gap-6 self-start pb-12 lg:sticky"
          style={{ top: "min(8rem, calc(100vh - 100% - 2rem))" }}
        >
          <div className="space-y-3">
            <AnimatedTitle
              as="h1"
              text={project.title}
              className="text-2xl font-medium leading-tight tracking-tight text-white md:text-3xl"
              splitBy="word"
              eager={true}
            />
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {project.problemStatement && (
            <SectionReveal delay={0.1} className="space-y-2">
              <h2 className="text-sm font-normal text-white/40">Problem statement</h2>
              <p className="whitespace-pre-line text-sm font-normal leading-relaxed text-white/80">
                {project.problemStatement}
              </p>
            </SectionReveal>
          )}

          {project.solution && (
            <SectionReveal delay={0.2} className="space-y-2 border-t border-white/10 pt-6">
              <h2 className="text-sm font-normal text-white/40">TII solution</h2>
              <p className="whitespace-pre-line text-sm font-normal leading-relaxed text-white/80">
                {project.solution}
              </p>
            </SectionReveal>
          )}

          {project.deliverables && project.deliverables.length > 0 && (
            <SectionReveal delay={0.3} className="space-y-2 border-t border-white/10 pt-6">
              <h2 className="text-sm font-normal text-white/40">Deliverables</h2>
              <ul className="space-y-1.5">
                {project.deliverables.map((item, idx) => (
                  <li key={idx} className="text-sm font-normal leading-relaxed text-white/80">
                    {item}
                  </li>
                ))}
              </ul>
            </SectionReveal>
          )}
        </div>
      </div>

      <SlidePageBody>
        <section className="mt-16 border-y border-white/10 bg-[#1d1d1d] py-20 text-center md:mt-24 md:py-28 lg:py-36">
          <div className="site-container-xwide space-y-8">
            <div className="mx-auto max-w-3xl space-y-8">
            <h2 className="text-balance text-2xl font-normal tracking-tight text-white md:text-3xl">
              <AnimatedTitle
                as="span"
                text={lang === "fr" ? "Un projet similaire" : "A similar project"}
                className="inline"
                splitBy="word"
              />{" "}
              <AnimatedTitle
                as="span"
                text={lang === "fr" ? "en tête ?" : "on your mind?"}
                className="inline text-[#75DAB4] underline decoration-2 underline-offset-8"
                splitBy="word"
                delay={0.12}
              />
            </h2>
            <p className="text-lg font-light text-white/50">
              {lang === "fr"
                ? "Écrivez-nous. Nous vous dirons si nous pouvons aider, et comment commencer."
                : "Write to us. We will tell you if we can help, and how to begin."}
            </p>
            <CurtainLink
              href={`/${lang}/contact`}
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.08] px-8 py-4 text-sm font-normal text-white/90 transition-colors hover:border-white/40 hover:bg-white/[0.14] hover:text-white"
            >
              {lang === "fr" ? "Écrire à l'équipe" : "Write to the team"}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </CurtainLink>
            </div>
          </div>
        </section>
      </SlidePageBody>
    </div>
  );
}
