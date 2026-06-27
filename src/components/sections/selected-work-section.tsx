import Image from "next/image";
import Link from "next/link";

import { SectionReveal } from "@/components/ui/section-reveal";
import { sectionTitleDarkClass } from "@/components/ui/section-title-style";
import { urlForImage } from "@/lib/sanity.image";
import type { Project } from "@/lib/types";

type SelectedWorkSectionProps = {
  projects: Project[];
};

export function SelectedWorkSection({ projects }: SelectedWorkSectionProps) {
  return (
    <section id="work" className="py-16 md:py-24 lg:py-32">
      <div className="site-container">
        <SectionReveal>
          <div className="mb-12 flex items-end justify-between gap-4">
            <h2 className={sectionTitleDarkClass}>
              Selected Work
            </h2>
            <p className="max-w-[40ch] text-sm-fluid leading-relaxed text-neutral-400">
              Crafted for premium brands, optimized for business outcomes.
            </p>
          </div>
        </SectionReveal>
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => {
            const imageUrl = project.coverImage
              ? urlForImage(project.coverImage)?.width(1200).height(900).url()
              : null;

            return (
              <SectionReveal key={project._id}>
                <article className="group rounded-3xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/25">
                  <Link href={`/work/${project.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-900">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={project.coverImage?.alt ?? `${project.title} cover image`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-500">
                          No image available
                        </div>
                      )}
                    </div>
                    <div className="px-2 pb-2 pt-6">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h3 className="text-lg-fluid font-medium text-white">{project.title}</h3>
                        <span className="text-xs-fluid uppercase tracking-label text-neutral-400">
                          {project.year ?? "Current"}
                        </span>
                      </div>
                      <p className="text-sm-fluid leading-relaxed text-neutral-400 max-w-[45ch]">{project.excerpt}</p>
                    </div>
                  </Link>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
