import { SectionReveal } from "@/components/ui/section-reveal";
import { sectionTitleDarkClass } from "@/components/ui/section-title-style";
import type { AboutContent } from "@/lib/types";

type AboutSectionProps = {
  about: AboutContent;
};

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="py-20">
      <div className="site-container">
        <SectionReveal className="grid gap-10 border-y border-white/10 py-12 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-sm uppercase tracking-[0.24em] text-neutral-400">About</h2>
          <div>
            <h3 className={sectionTitleDarkClass}>{about.heading}</h3>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">{about.story}</p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
