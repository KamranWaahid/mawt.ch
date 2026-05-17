import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe, ArrowRight, CheckCircle2 } from "lucide-react";

import { SectionReveal } from "@/components/ui/section-reveal";
import { getProjectBySlug, getDictionaryFromSanity } from "@/lib/sanity.queries";
import { urlForImage } from "@/lib/sanity.image";
import { getDictionary } from "@/get-dictionary";
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
  const dict = await getDictionary(lang);

  if (!project) {
    notFound();
  }

  const heroImage = project.coverImage
    ? urlForImage(project.coverImage)?.width(2400).height(1200).url()
    : null;

  return (
    <main className="w-full bg-white text-black min-h-screen">
      {/* Top Navigation Bar */}


      {/* Main Split Container */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 pt-32 md:pt-40 pb-12 md:pb-16 grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8 lg:gap-12 items-start">
        
        {/* IMAGES COLUMN: Visual Assets Only (Left Side) */}
        <div className="space-y-4 lg:space-y-6">
          
          {/* Main Hero Image */}
          <SectionReveal className="w-full relative overflow-hidden bg-neutral-100">
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
          {project.problemImage && (
            <SectionReveal className="w-full relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlForImage(project.problemImage)?.width(1600).url() || ""}
                alt="Problem visualization"
                className="w-full h-auto object-contain"
              />
            </SectionReveal>
          )}

          {/* Solution Image */}
          {project.solutionImage && (
            <SectionReveal className="w-full relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlForImage(project.solutionImage)?.width(1600).url() || ""}
                alt="Solution visualization"
                className="w-full h-auto object-contain"
              />
            </SectionReveal>
          )}

          {/* Project Gallery Images */}
          {project.gallery && project.gallery.length > 0 && (
            <>
              {project.gallery.map((image, idx) => (
                <SectionReveal key={idx} className="w-full relative overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlForImage(image)?.width(1600).url() || ""}
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
          <SectionReveal className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-black leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-neutral-100 text-neutral-500 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </SectionReveal>

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
      <section className="py-24 px-6 text-center bg-neutral-50 border-t border-black/5 mt-24">
        <SectionReveal className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-black">
            Ready to build <span className="text-[#75DAB4] underline decoration-2 underline-offset-8">something exceptional?</span>
          </h2>
          <p className="text-neutral-500 font-light text-lg">
            Let&apos;s discuss how MAWT can elevate your digital infrastructure.
          </p>
          <Link 
            href={`/${lang}/contact`}
            className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full font-bold hover:bg-[#75DAB4] hover:text-black transition-colors shadow-lg"
          >
            Start a Conversation
            <ArrowRight size={20} />
          </Link>
        </SectionReveal>
      </section>
    </main>
  );
}
