import Link from "next/link";
import { sectionTitleDarkClass } from "@/components/ui/section-title-style";
import type { Locale } from "@/i18n-config";

/**
 * Reusable "AI maturity audit" conversion block. Flat design (no shadow,
 * weight 400). Defaults to a Geneva-anchored 30 minute diagnostic offer but
 * the headline/sub/label can be overridden per placement.
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
    <section className="bg-black text-white py-16 md:py-20 lg:py-24 text-center">
      <div className="max-w-3xl mx-auto space-y-5">
        <span className="text-xs-fluid text-[#75DAB4] font-medium block">
          {c.kicker}
        </span>
        <h2 className={`${sectionTitleDarkClass} mx-auto`}>
          {headline ?? c.headline}
        </h2>
        <p className="text-base-fluid text-white/70 font-normal leading-relaxed max-w-[55ch] mx-auto">
          {sub ?? c.sub}
        </p>
        <div className="pt-2">
          <Link
            href={target}
            className="inline-block px-6 py-3 bg-[#75DAB4] text-black text-sm font-medium tracking-tight rounded-sm hover:bg-white transition-colors"
          >
            {label ?? c.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
