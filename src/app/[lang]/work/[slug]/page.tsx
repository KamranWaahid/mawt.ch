import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { SectionReveal } from "@/components/ui/section-reveal";
import { getProjectBySlug } from "@/lib/sanity.queries";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { urlForImage } from "@/lib/sanity.image";
import type { Locale } from "@/i18n-config";

type ProjectPageProps = {
  params: Promise<{ slug: string; lang: Locale }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
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
    title: `${project.title} | MAWT Portfolio`,
    description: project.excerpt,
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

  return (
    <main className="w-full text-black min-h-screen">
      {/* Top Navigation Bar */}


      {/* Main Split Container */}
      <div className="site-container-wide pt-32 md:pt-40 pb-12 md:pb-16 grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8 lg:gap-12 items-start">
        
        {/* IMAGES COLUMN: Visual Assets Only (Left Side) */}
        <div className="space-y-4 lg:space-y-6">
          
          {/* Main Hero Image */}
          <SectionReveal className="w-full relative overflow-hidden rounded-2xl bg-white/45">
            {heroImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroImage}
                alt={project.coverImage?.alt ?? project.title}
                className="w-full h-auto object-contain"
              />
            ) : null}
          </SectionReveal>

          {/* Problem Image */}
          {problemImage && (
            <SectionReveal className="w-full relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={problemImage}
                alt="Problem visualization"
                className="w-full h-auto object-contain"
              />
            </SectionReveal>
          )}

          {/* Solution Image */}
          {solutionImage && (
            <SectionReveal className="w-full relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={solutionImage}
                alt="Solution visualization"
                className="w-full h-auto object-contain"
              />
            </SectionReveal>
          )}

          {/* Project Gallery Images */}
          {galleryImages.length > 0 && (
            <>
              {galleryImages.map(({ image, idx, src }) => (
                <SectionReveal key={idx} className="w-full relative overflow-hidden rounded-2xl bg-white/45">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={image.alt || `Gallery image ${idx}`}
                    className="w-full h-auto object-contain"
                  />
                </SectionReveal>
              ))}
            </>
          )}

        </div>

        {/* TEXT COLUMN: Sticky Details (Right Side) */}
        <div 
          className="lg:sticky pb-12 self-start flex flex-col gap-6"
          style={{ top: 'min(8rem, calc(100vh - 100% - 2rem))' }}
        >
          <div className="space-y-3">
            <AnimatedTitle
              as="h1"
              text={project.title}
              className="text-2xl md:text-3xl font-medium tracking-tight text-black leading-tight"
              splitBy="word"
              eager={true}
            />
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-neutral-100 text-neutral-500 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {project.problemStatement && (
            <SectionReveal delay={0.1} className="space-y-2">
              <h2 className="text-sm text-neutral-400 font-normal">Problem statement</h2>
              <p className="text-sm text-black font-normal leading-relaxed whitespace-pre-line">
                {project.problemStatement}
              </p>
            </SectionReveal>
          )}

          {project.solution && (
            <SectionReveal delay={0.2} className="pt-6 border-t border-neutral-200 space-y-2">
              <h2 className="text-sm text-neutral-400 font-normal">TII solution</h2>
              <p className="text-sm text-black font-normal leading-relaxed whitespace-pre-line">
                {project.solution}
              </p>
            </SectionReveal>
          )}

          {project.deliverables && project.deliverables.length > 0 && (
            <SectionReveal delay={0.3} className="pt-6 border-t border-neutral-200 space-y-2">
              <h2 className="text-sm text-neutral-400 font-normal">Deliverables</h2>
              <ul className="space-y-1.5">
                {project.deliverables.map((item, idx) => (
                  <li key={idx} className="text-sm text-black font-normal leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </SectionReveal>
          )}
        </div>
      </div>

      {/* Global Footer CTA */}
      <section className="py-20 md:py-28 lg:py-36 text-center bg-neutral-50 border-t border-black/5 mt-16 md:mt-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-black text-balance">
            <AnimatedTitle
              as="span"
              text="Ready to build"
              className="inline"
              splitBy="word"
            />{" "}
            <AnimatedTitle
              as="span"
              text="something exceptional?"
              className="text-[#75DAB4] underline decoration-2 underline-offset-8 inline"
              splitBy="word"
              delay={0.12}
            />
          </h2>
          <p className="text-neutral-500 font-light text-lg">
            Let&apos;s discuss how MAWT can elevate your digital infrastructure.
          </p>
          <Link 
            href={`/${lang}/contact`}
            className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full font-normal hover:bg-[#75DAB4] hover:text-black transition-colors"
          >
            Start a Conversation
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
