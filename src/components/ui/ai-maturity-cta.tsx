import { CurtainLink } from "@/components/ui/curtain-link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n-config";

/**
 * Reusable "AI maturity audit" conversion block.
 * Defaults to a Geneva-anchored 30 minute diagnostic offer.
 */
const COPY = {
  fr: {
    kicker: "Audit de maturité IA",
    headline: "Réservez un diagnostic IA à Genève (30 minutes).",
    sub: "Un échange court et concret avec un expert senior. On regarde vos process, vos données et vos outils, et on identifie deux ou trois leviers IA à fort impact pour votre entreprise.",
    label: "Réserver mon diagnostic",
  },
  en: {
    kicker: "AI maturity audit",
    headline: "Book a 30 minute AI diagnostic in Geneva.",
    sub: "A short, concrete call with a senior expert. We look at your processes, your data and your tools, then identify two or three high impact AI levers for your business.",
    label: "Book my diagnostic",
  },
} as const;

export function AiMaturityCta({
  lang,
  headline,
  sub,
  label,
  href,
}: {
  lang: Locale;
  headline?: string;
  sub?: string;
  label?: string;
  href?: string;
}) {
  const c = COPY[lang] ?? COPY.en;
  const target = href ?? `/${lang}/contact`;

  return (
    <section className="border-t border-white/10 py-20 md:py-28 lg:py-36">
      <div className="site-container-xwide">
        <p className="mb-6 text-[13px] font-normal text-white/40">{c.kicker}</p>
        <h2 className="max-w-[16ch] text-[clamp(2.2rem,4.6vw,4rem)] font-medium leading-[1.05] tracking-tight text-white">
          {headline ?? c.headline}
        </h2>
        <p className="mt-6 max-w-[52ch] text-[15px] font-normal leading-relaxed text-white/55">
          {sub ?? c.sub}
        </p>
        <CurtainLink
          href={target}
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
        >
          {label ?? c.label}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
            <ArrowRight size={13} aria-hidden="true" />
          </span>
        </CurtainLink>
      </div>
    </section>
  );
}
