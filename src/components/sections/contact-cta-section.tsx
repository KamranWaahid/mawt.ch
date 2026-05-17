import { MagneticButton } from "@/components/ui/magnetic-button";
import { SectionReveal } from "@/components/ui/section-reveal";
import type { SiteSettings } from "@/lib/types";

type ContactCtaSectionProps = {
  settings: SiteSettings;
};

export function ContactCtaSection({ settings }: ContactCtaSectionProps) {
  return (
    <section id="contact" className="px-6 pb-24 pt-16 md:px-12">
      <SectionReveal className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#1f1b18] to-[#111111] px-6 py-14 md:px-12">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Contact</p>
        <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-6xl">
          Ready to build your next defining digital presence?
        </h2>
        <div className="mt-10">
          <MagneticButton href={settings.ctaHref}>{settings.ctaLabel}</MagneticButton>
        </div>
      </SectionReveal>
    </section>
  );
}
