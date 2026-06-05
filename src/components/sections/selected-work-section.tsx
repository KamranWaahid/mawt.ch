import Image from "next/image";
import Link from "next/link";

import { SectionReveal } from "@/components/ui/section-reveal";
import { urlForImage } from "@/lib/sanity.image";
import type { Project } from "@/lib/types";

type SelectedWorkSectionProps = {
  projects: Project[];
};

export function SelectedWorkSection({ projects }: SelectedWorkSectionProps) {
  return (
    <section id="work" className="px-8 py-20 md:px-16 lg:px-24">
      <SectionReveal>
        <div className="mb-12 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-normal tracking-tight text-white md:text-5xl">
            Selected Work
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
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
                <Link href={`/projects/${project.slug}`} className="block">
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
                      <h3 className="text-2xl font-medium text-white">{project.title}</h3>
                      <span className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                        {project.year ?? "Current"}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-neutral-300">{project.excerpt}</p>
                  </div>
                </Link>
              </article>
            </SectionReveal>
          );
        })}
      </div>
    </section>
  );
}
