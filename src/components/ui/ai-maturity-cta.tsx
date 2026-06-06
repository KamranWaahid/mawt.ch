import Link from "next/link";
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
    <section className="bg-black text-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#75DAB4] font-normal block">
          {c.kicker}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.15] text-balance">
          {headline ?? c.headline}
        </h2>
        <p className="text-lg text-white/70 font-normal leading-relaxed max-w-2xl mx-auto">
          {sub ?? c.sub}
        </p>
        <div className="pt-2">
          <Link
            href={target}
            className="inline-block px-8 py-4 bg-[#75DAB4] text-black text-sm font-normal uppercase tracking-widest rounded-sm hover:bg-white transition-colors"
          >
            {label ?? c.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
