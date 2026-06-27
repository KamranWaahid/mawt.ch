import { MagneticButton } from "@/components/ui/magnetic-button";
import { SectionReveal } from "@/components/ui/section-reveal";
import { sectionTitleDarkClass } from "@/components/ui/section-title-style";
import type { SiteSettings } from "@/lib/types";

type ContactCtaSectionProps = {
  settings: SiteSettings;
};

export function ContactCtaSection({ settings }: ContactCtaSectionProps) {
  return (
    <section id="contact" className="pb-24 pt-16">
      <div className="site-container">
        <SectionReveal className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#1f1b18] to-[#111111] px-6 py-14 md:px-12">
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Contact</p>
          <h2 className={`${sectionTitleDarkClass} mt-5`}>
            Ready to build your next defining digital presence?
          </h2>
          <div className="mt-10">
            <MagneticButton href={settings.ctaHref}>{settings.ctaLabel}</MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
