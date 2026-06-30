"use client";

import { useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import type { SiteSettings } from "@/lib/types";
import { localizedHref } from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";

type HomepageHeroCopy = {
  statement: string;
  description: string;
  cta: string;
};

type HomepageTransitionCopy = {
  statement: string;
  cta: string;
};

type HomepageHeroSectionProps = {
  settings: SiteSettings;
  dict: HomepageHeroCopy;
  transitionDict: HomepageTransitionCopy;
};

const socialLinks = [
  { href: "https://facebook.com/mawt.ch", label: "Facebook", icon: FaFacebookF },
  { href: "https://x.com/mawt.ch", label: "X", icon: FaXTwitter },
  { href: "https://instagram.com/mawt.ch", label: "Instagram", icon: FaInstagram },
  { href: "https://linkedin.com/company/mawt.ch", label: "LinkedIn", icon: FaLinkedinIn },
];

const navItems = [
  { label: "Work", route: "projets" },
  { label: "Approach", route: "notre-methode" },
  { label: "Services", route: "services" },
  { label: "News", route: "news" },
  { label: "About", route: "a-propos" },
  { label: "Contact", route: "contact" },
];

function GeometricSymbol({ className }: { className?: string }) {
  return (
    <svg
      width="90"
      height="56"
      viewBox="0 0 90 56"
      fill="none"
      aria-hidden="true"
      className={className || "h-10 w-[65px] text-white sm:h-12 sm:w-[78px]"}
    >
      <circle cx="45" cy="28" r="21" stroke="currentColor" strokeWidth="1" />
      <circle cx="27.8" cy="28" r="26.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="62.2" cy="28" r="26.5" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="28" x2="90" y2="28" stroke="currentColor" strokeWidth="1" />
      <line x1="12.2" y1="6.3" x2="77.1" y2="49.8" stroke="currentColor" strokeWidth="1" />
      <line x1="77.4" y1="6.3" x2="12.5" y2="49.8" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function SwissMark() {
  return (
    <span className="mx-[0.3em] inline-flex h-[1.08em] w-[1.55em] translate-y-[0.16em] items-center justify-center align-baseline">
      <svg
        viewBox="0 0 28 20"
        fill="none"
        aria-hidden="true"
        className="block h-full w-full"
        shapeRendering="crispEdges"
      >
        <rect width="28" height="20" fill="#E1251B" />
        <rect x="12" y="4" width="4" height="12" fill="white" />
        <rect x="8" y="8" width="12" height="4" fill="white" />
      </svg>
      <span className="sr-only">Swiss</span>
    </span>
  );
}

function MawatLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 696 160" fill="none" aria-hidden="true" className={className}>
      <path d="M36.3703 87.5942H0V123.965H36.3703V87.5942Z" fill="#75DAB4" />
      <path d="M295.364 122.065L267.051 92.625C257.992 96.2525 250.068 102.133 250.068 114.142C250.068 126.819 261.161 134.293 271.805 134.293C281.771 134.293 289.694 129.759 295.364 122.065Z" fill="white" />
      <path d="M317.328 144.708C310.598 151.992 302.073 157.376 292.613 160.335H332.497L317.328 144.708Z" fill="white" />
      <path d="M566.68 0H526.367L500.555 106.667H499.877L471.115 0H430.802L402.269 106.667H401.591L376.228 0H303.554C318.025 5.79443 328.879 17.6124 328.879 36.4658C328.879 56.8465 314.388 69.5332 296.719 78.3632L316.87 98.9731L332.946 74.2871H374.166L339.514 120.709L379.368 160.344H418.555L450.257 51.8635H450.935L482.637 160.344H520.907L557.22 33.0674H611.947V160.344H650.676V33.0674H695.971V0H566.661H566.68Z" fill="white" />
      <path d="M280.413 22.8723C271.583 22.8723 265.016 29.2109 265.016 37.5923C265.016 45.0668 269.321 52.0831 277.015 58.4217C287.21 54.3455 295.582 47.3292 295.582 37.5923C295.582 29.44 289.692 22.8723 280.413 22.8723Z" fill="white" />
      <path d="M36.3709 123.965V160.335H72.8271L72.7603 123.965H36.3613H36.3709Z" fill="white" />
      <path d="M212.934 115.726C212.934 93.0832 228.781 79.041 246.45 71.3374C236.484 61.6004 229.917 50.2789 229.917 36.4658C229.917 17.3356 241.362 5.70852 255.977 0H163.648L128.777 102.82H127.87L91.4039 0H36.3711V87.5942H72.7032L72.6364 46.9569L113.15 160.344H140.327L181.996 46.8805H182.673L181.766 160.344H248.197C228.37 154.359 212.934 139.801 212.934 115.726Z" fill="white" />
    </svg>
  );
}

function StatementWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = 0.86 + index * 0.003;
  const end = Math.min(0.995, start + 0.045);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);
  const blur = useTransform(progress, [start, end], ["blur(10px)", "blur(0px)"]);

  return (
    <span className="inline">
      <motion.span
        className="inline-block will-change-[transform,opacity,filter]"
        style={{ opacity, y, filter: blur }}
      >
        {word}
      </motion.span>
      {index < total - 1 ? " " : null}
    </span>
  );
}

function HeroGradientStatement({
  text,
  progress,
}: {
  text: string;
  progress: MotionValue<number>;
}) {
  const words = text.split(" ");

  return (
    <h2 className="max-w-[1040px] select-text font-serif text-[clamp(2.1rem,4.05vw,3.7rem)] font-normal leading-[1.01] tracking-normal text-white">
      {words.map((word, index) => (
        <StatementWord
          key={`${word}-${index}`}
          word={word}
          index={index}
          total={words.length}
          progress={progress}
        />
      ))}
    </h2>
  );
}

export function HomepageHeroSection({ settings, dict, transitionDict }: HomepageHeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const params = useParams();
  const lang = (params?.lang === "fr" ? "fr" : "en") as Locale;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const navbarOpacity = useTransform(scrollYProgress, [0.08, 0.32], [0, 1]);
  const navbarY = useTransform(scrollYProgress, [0.08, 0.32], [-20, 0]);
  const navLinksOpacity = useTransform(scrollYProgress, [0.28, 0.55], [0, 1]);
  const heroLogoScale = useTransform(scrollYProgress, [0, 0.74], [1, 0.072]);
  const heroLogoX = useTransform(scrollYProgress, [0, 0.74], ["0%", "-0.6%"]);
  const heroLogoY = useTransform(scrollYProgress, [0, 0.74], ["0svh", "-4.2svh"]);
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.6, 0.7], [1, 1, 0]);
  const desktopContentY = useTransform(scrollYProgress, [0, 0.64, 1], ["0svh", "-42svh", "-42svh"]);
  const compactContentY = useTransform(scrollYProgress, [0, 0.64, 1], ["0svh", "-20svh", "-20svh"]);
  const transitionGradientOpacity = useTransform(scrollYProgress, [0.74, 0.88], [0, 1]);
  const transitionStatementOpacity = useTransform(scrollYProgress, [0.82, 0.92, 0.995, 1], [0, 1, 1, 0]);
  const transitionStatementY = useTransform(scrollYProgress, [0.82, 0.94, 1], [26, 0, -4]);
  const transitionCtaOpacity = useTransform(scrollYProgress, [0.91, 0.97, 1], [0, 1, 0]);
  const transitionCtaY = useTransform(scrollYProgress, [0.91, 0.98, 1], [16, 0, -4]);
  const compactLogoScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.72]);
  const compactLogoY = useTransform(scrollYProgress, [0, 0.8], ["0svh", "-2svh"]);
  const compactLogoOpacity = useTransform(scrollYProgress, [0.55, 0.9], [1, 0.25]);

  const navHref = (route: string) => {
    if (route === "news") return `/${lang}/news`;
    return localizedHref(route, lang);
  };

  return (
    <section ref={sectionRef} className="relative z-50 h-[300svh] w-full bg-black text-white">
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,#000000_0%,#020807_9%,#001015_20%,#00212A_33%,#002B36_43%,#0F4C46_55%,#28725F_66%,#3D9479_76%,#5EC9A0_84%,#75DAB4_90%,#A9EFD6_95%,#D5FFEF_98%,#F6F5F4_100%)]"
          style={{ opacity: transitionGradientOpacity }}
        />

        <motion.nav
          aria-label="Homepage transition navigation"
          className="absolute left-0 right-0 top-0 z-50 px-5 pt-[clamp(1.15rem,3.5vh,2.3rem)] sm:px-7 md:px-9 lg:px-[2.5vw]"
          style={{ opacity: navbarOpacity, y: navbarY }}
        >
          <div className="mx-auto flex w-full max-w-[1760px] items-start justify-between gap-5 md:gap-8">
            <motion.div
              className="ml-auto hidden flex-wrap items-center justify-end gap-x-5 gap-y-3 bg-black/10 text-[13px] font-normal leading-none text-white/72 md:flex lg:gap-x-8 lg:text-[14px]"
              style={{ opacity: navLinksOpacity }}
            >
              {navItems.map((item) => (
                <Link key={item.route} href={navHref(item.route)} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              ))}
              <span className="text-white/25">—</span>
              <Link href="/fr" className={`transition-colors hover:text-white ${lang === "fr" ? "text-white" : ""}`}>
                FR
              </Link>
              <span className="text-white/45">/</span>
              <Link href="/en" className={`transition-colors hover:text-white ${lang === "en" ? "text-white" : ""}`}>
                EN
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-[13px] font-normal leading-none text-white/72 md:hidden"
              style={{ opacity: navLinksOpacity }}
            >
              <Link href="/fr" className={`transition-colors hover:text-white ${lang === "fr" ? "text-white" : ""}`}>
                FR
              </Link>
              <span className="text-white/45">/</span>
              <Link href="/en" className={`transition-colors hover:text-white ${lang === "en" ? "text-white" : ""}`}>
                EN
              </Link>
            </motion.div>
          </div>
        </motion.nav>

      {/* Desktop Canvas (lg screens) */}
      <div
        className="relative z-10 hidden h-full w-full max-w-[1760px] flex-shrink-0 bg-transparent @container lg:block"
      >
        <motion.h1
          aria-label="MAWT"
          className="absolute left-[2.5%] top-[6.5%] z-40 w-[95%]"
          style={{
            scale: heroLogoScale,
            x: heroLogoX,
            y: heroLogoY,
            transformOrigin: "0% 0%",
          }}
        >
          <MawatLogo className="h-auto w-full" />
        </motion.h1>

        <motion.div
          className="absolute left-[2.5%] top-[62%]"
          style={{ opacity: heroContentOpacity, y: desktopContentY }}
        >
          <GeometricSymbol className="h-[4.35cqw] w-[7.03cqw] max-h-[56px] max-w-[90px] text-white" />
        </motion.div>

        <motion.p
          className="absolute left-[2.5%] top-[74%] w-[43%] text-[2.45cqw] font-normal leading-[1.16] tracking-[-0.02em] text-white"
          style={{ opacity: heroContentOpacity, y: desktopContentY }}
        >
          {dict.statement}
        </motion.p>

        <motion.div
          className="absolute left-[2.85%] top-[91.5%]"
          style={{ opacity: heroContentOpacity, y: desktopContentY }}
        >
        <Link
          href={settings.ctaHref}
          className="inline-flex items-center text-[1.17cqw] font-normal leading-none text-white transition-colors hover:text-[#75DAB4]"
        >
          <span aria-hidden="true" className="mr-[0.46875cqw]">
            →
          </span>
          {dict.cta}
        </Link>
        </motion.div>

        <motion.p
          className="absolute left-[65.5%] top-[74.4%] w-[30.5%] text-[1.17cqw] font-normal leading-[1.35] tracking-[-0.01em] text-white/74"
          style={{ opacity: heroContentOpacity, y: desktopContentY }}
        >
          <span className="text-white">MAWT is a</span>
          <SwissMark />
          {dict.description}
        </motion.p>

        <motion.ul
          className="absolute right-[2.5%] top-[91.5%] flex items-center gap-[1.5625cqw]"
          aria-label="Social links"
          style={{ opacity: heroContentOpacity, y: desktopContentY }}
        >
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-[1.5625cqw] w-[1.5625cqw] items-center justify-center text-white transition-colors hover:text-[#75DAB4]"
              >
                <Icon className="h-[1.17cqw] w-[1.17cqw]" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[43svh] z-30 hidden px-5 sm:px-7 md:px-9 lg:block lg:px-[2.5vw]"
        style={{ opacity: transitionStatementOpacity, y: transitionStatementY }}
      >
        <div className="mx-auto w-full max-w-[1760px]">
          <HeroGradientStatement text={transitionDict.statement} progress={scrollYProgress} />
          <motion.div
            className="mt-10"
            style={{ opacity: transitionCtaOpacity, y: transitionCtaY }}
          >
            <Link
              href={localizedHref("a-propos", lang)}
              className="pointer-events-auto inline-flex h-10 items-center rounded-full border border-white/12 bg-white/[0.12] px-[22px] text-[13px] font-normal leading-none text-white/92 backdrop-blur-md transition-colors duration-300 hover:border-white/22 hover:bg-white/[0.18] hover:text-white"
            >
              {transitionDict.cta}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div className="landscapeHero relative z-10 hidden h-[100svh] w-full overflow-hidden bg-black px-8 py-5 text-white lg:hidden">
        <div className="relative h-full w-full">
          <motion.h1 aria-label="MAWT" className="absolute left-[2%] top-[5%] w-[82%] select-none" style={{ opacity: compactLogoOpacity, scale: compactLogoScale, y: compactLogoY, transformOrigin: "0% 0%" }}>
            <MawatLogo className="h-auto w-full" />
          </motion.h1>

          <motion.div className="absolute left-[2%] top-[56%]" style={{ y: compactContentY }}>
            <GeometricSymbol className="h-7 w-[45px] text-white" />
          </motion.div>

          <motion.p className="absolute left-[2%] top-[65%] w-[48%] text-[clamp(1.2rem,3vw,1.55rem)] font-normal leading-[1.06] tracking-[-0.02em] text-white" style={{ y: compactContentY }}>
            {dict.statement}
          </motion.p>

          <motion.div className="absolute left-[6.5%] top-[88%]" style={{ y: compactContentY }}>
          <Link
            href={settings.ctaHref}
            className="inline-flex items-center text-[0.8125rem] font-normal leading-none text-white transition-colors hover:text-[#75DAB4]"
          >
            <span aria-hidden="true" className="mr-1.5">
              →
            </span>
            {dict.cta}
          </Link>
          </motion.div>

          <motion.p className="absolute left-[59%] top-[68%] w-[38%] text-[0.8125rem] font-normal leading-[1.32] tracking-[-0.01em] text-white/74" style={{ y: compactContentY }}>
            <span className="text-white">MAWT is a</span>
            <SwissMark />
            {dict.description}
          </motion.p>

          <motion.ul className="absolute right-[2%] top-[88%] flex items-center gap-4" aria-label="Social links" style={{ y: compactContentY }}>
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-5 w-5 items-center justify-center text-white transition-colors hover:text-[#75DAB4]"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <div className="portraitHero relative z-10 flex h-[100svh] w-full flex-col justify-between overflow-hidden bg-black px-5 py-6 text-white sm:px-7 sm:py-8 md:px-9 md:py-10 lg:hidden">
        <div className="w-full">
          <motion.h1 aria-label="MAWT" className="select-none" style={{ opacity: compactLogoOpacity, scale: compactLogoScale, y: compactLogoY, transformOrigin: "0% 0%" }}>
            <MawatLogo className="h-auto w-full max-w-[92vw] sm:max-w-[88vw] md:max-w-[82vw]" />
          </motion.h1>
        </div>

        <motion.div className="mt-auto flex flex-col gap-[clamp(1rem,3svh,2rem)] pt-5 sm:pt-8" style={{ y: compactContentY }}>
          <div>
            <GeometricSymbol className="h-[clamp(2rem,6vw,3.25rem)] w-[clamp(3.25rem,10vw,5.25rem)] text-white" />
          </div>

          <div className="grid gap-[clamp(1rem,3svh,1.75rem)] md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.8fr)] md:items-end md:gap-10">
            <div>
              <p className="text-[clamp(1.35rem,7vw,2.25rem)] font-normal leading-[1.14] tracking-[-0.02em] text-white md:text-[clamp(1.75rem,4vw,2.4rem)]">
                {dict.statement}
              </p>
              <Link
                href={settings.ctaHref}
                className="mt-[clamp(1rem,3svh,1.6rem)] inline-flex items-center text-[0.875rem] font-normal leading-none text-white transition-colors hover:text-[#75DAB4] sm:text-[0.9375rem]"
              >
                <span aria-hidden="true" className="mr-1.5">
                  →
                </span>
                {dict.cta}
              </Link>
            </div>

            <div className="flex flex-col gap-[clamp(1rem,3svh,1.5rem)] md:items-start">
              <p className="max-w-[26rem] text-[0.8125rem] font-normal leading-[1.35] tracking-[-0.01em] text-white/74 sm:text-[0.9375rem] md:max-w-none">
                <span className="text-white">MAWT is a</span>
                <SwissMark />
                {dict.description}
              </p>

              <ul className="flex items-center gap-4" aria-label="Social links">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-5 w-5 items-center justify-center text-white transition-colors hover:text-[#75DAB4]"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1023px) and (max-height: 520px) and (orientation: landscape) {
          .portraitHero {
            display: none;
          }

          .landscapeHero {
            display: block;
          }
        }
      `}</style>
      </div>
    </section>
  );
}
