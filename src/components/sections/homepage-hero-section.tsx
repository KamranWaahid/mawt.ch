"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useMotionValueEvent, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Menu, X } from "lucide-react";
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

const mawatLogoPaths = [
  "M36.3703 87.5942H0V123.965H36.3703V87.5942Z",
  "M295.364 122.065L267.051 92.625C257.992 96.2525 250.068 102.133 250.068 114.142C250.068 126.819 261.161 134.293 271.805 134.293C281.771 134.293 289.694 129.759 295.364 122.065Z",
  "M317.328 144.708C310.598 151.992 302.073 157.376 292.613 160.335H332.497L317.328 144.708Z",
  "M566.68 0H526.367L500.555 106.667H499.877L471.115 0H430.802L402.269 106.667H401.591L376.228 0H303.554C318.025 5.79443 328.879 17.6124 328.879 36.4658C328.879 56.8465 314.388 69.5332 296.719 78.3632L316.87 98.9731L332.946 74.2871H374.166L339.514 120.709L379.368 160.344H418.555L450.257 51.8635H450.935L482.637 160.344H520.907L557.22 33.0674H611.947V160.344H650.676V33.0674H695.971V0H566.661H566.68Z",
  "M280.413 22.8723C271.583 22.8723 265.016 29.2109 265.016 37.5923C265.016 45.0668 269.321 52.0831 277.015 58.4217C287.21 54.3455 295.582 47.3292 295.582 37.5923C295.582 29.44 289.692 22.8723 280.413 22.8723Z",
  "M36.3709 123.965V160.335H72.8271L72.7603 123.965H36.3613H36.3709Z",
  "M212.934 115.726C212.934 93.0832 228.781 79.041 246.45 71.3374C236.484 61.6004 229.917 50.2789 229.917 36.4658C229.917 17.3356 241.362 5.70852 255.977 0H163.648L128.777 102.82H127.87L91.4039 0H36.3711V87.5942H72.7032L72.6364 46.9569L113.15 160.344H140.327L181.996 46.8805H182.673L181.766 160.344H248.197C228.37 154.359 212.934 139.801 212.934 115.726Z",
];

function MawatLogo({
  className,
  tone = "light",
  videoFill = false,
}: {
  className?: string;
  tone?: "light" | "dark";
  videoFill?: boolean;
}) {
  const rawId = useId();
  const logoId = rawId.replace(/:/g, "");
  const clipPathId = `mawt-logo-shape-${logoId}`;

  return (
    <svg
      viewBox="0 0 696 160"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <clipPath id={clipPathId}>
          {mawatLogoPaths.map((path) => (
            <path key={`clip-${path}`} d={path} />
          ))}
        </clipPath>
      </defs>

      {mawatLogoPaths.map((path) => (
        <path key={`base-${path}`} d={path} fill={tone === "dark" ? "#050505" : "white"} />
      ))}

      {videoFill ? (
        <g clipPath={`url(#${clipPathId})`}>
          <foreignObject x="-18" y="-38" width="732" height="236">
            <video
              src="/MotionMAWT.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          </foreignObject>
        </g>
      ) : null}
    </svg>
  );
}

function MawatLogoMask({ className }: { className?: string }) {
  const rawId = useId();
  const maskId = `mawt-logo-hole-${rawId.replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 696 160"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <mask id={maskId}>
          <rect x="-10000" y="-10000" width="20000" height="20000" fill="white" />
          {mawatLogoPaths.map((path) => (
            <path key={`hole-${path}`} d={path} fill="black" />
          ))}
        </mask>
      </defs>
      <rect x="-10000" y="-10000" width="20000" height="20000" fill="black" mask={`url(#${maskId})`} />
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
  const start = 0.60 + index * 0.005;
  const end = Math.min(0.80, start + 0.05);
  
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);
  const blurValue = useTransform(progress, [start, end], [10, 0]);
  const filter = useTransform(blurValue, (b) => `blur(${b}px)`);

  return (
    <span className="inline">
      <motion.span
        className="inline-block will-change-[transform,opacity,filter]"
        style={{
          opacity,
          y,
          filter,
        }}
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
  className = "",
}: {
  text: string;
  progress: MotionValue<number>;
  className?: string;
}) {
  const words = text.split(" ");
  const exitOpacity = useTransform(progress, [0.90, 0.98], [1, 0]);

  return (
    <motion.h2
      className={`max-w-[1040px] select-text font-serif text-[clamp(2.1rem,4.05vw,3.7rem)] font-normal leading-[1.01] tracking-normal transition-colors duration-300 ${className}`}
      style={{ opacity: exitOpacity, color: "#F6F5F4" }}
    >
      {words.map((word, index) => (
        <StatementWord
          key={`${word}-${index}`}
          word={word}
          index={index}
          total={words.length}
          progress={progress}
        />
      ))}
    </motion.h2>
  );
}

export function HomepageHeroSection({ settings, dict, transitionDict }: HomepageHeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeroMobileMenuOpen, setIsHeroMobileMenuOpen] = useState(false);
  const params = useParams();
  const lang = (params?.lang === "fr" ? "fr" : "en") as Locale;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
    if (latest > 0.01 && videoRef.current && videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log("Autoplay prevented:", e);
        });
      }
    }
  });

  const navbarOpacity = useTransform(smoothProgress, [0.005, 0.07], [0, 1]);
  const navbarY = useTransform(smoothProgress, [0.005, 0.07], [-12, 0]);
  const navLinksOpacity = useTransform(smoothProgress, [0.8, 0.9], [0, 1]);
  const heroLogoScale = useTransform(smoothProgress, [0.15, 0.45], [1, 60]);
  const videoScale = useTransform(smoothProgress, [0.15, 0.45], [1, 1.1]);
  const heroLogoX = useTransform(smoothProgress, [0, 1], ["0%", "0%"]);
  const heroLogoY = useTransform(smoothProgress, [0, 1], ["0svh", "0svh"]);
  
  // Hero initial text fades out early, well before logo zoom gets large
  const heroContentOpacity = useTransform(smoothProgress, [0.05, 0.20], [1, 0]);
  
  // Video and logo mask fade out after logo is fully zoomed
  const heroLogoOpacity = useTransform(smoothProgress, [0.45, 0.52], [1, 0]);
  const videoContainerOpacity = useTransform(smoothProgress, [0.45, 0.52], [1, 0]);
  
  const navLogoOpacity = useTransform(smoothProgress, [0.8, 0.9], [0, 1]);
  
  const isHomeNavLight = scrollProgress >= 0.82;
  const homeNavTextClass = isHomeNavLight ? "text-black/70" : "text-white/72";
  const homeNavHoverClass = isHomeNavLight ? "hover:text-black" : "hover:text-white";
  const homeNavDividerClass = isHomeNavLight ? "text-black/25" : "text-white/25";
  const homeNavSlashClass = isHomeNavLight ? "text-black/45" : "text-white/45";
  const isTransitionTextDark = scrollProgress >= 0.64;
  const transitionCtaClass = isTransitionTextDark
    ? "border-black/12 bg-black/[0.04] text-black/92 hover:border-black/22 hover:bg-black/[0.08] hover:text-black"
    : "border-white/14 bg-white/[0.10] text-white/92 hover:border-white/24 hover:bg-white/[0.16] hover:text-white";
  const desktopContentY = useTransform(smoothProgress, [0, 1], ["0svh", "0svh"]);
  const compactContentY = useTransform(smoothProgress, [0, 1], ["0svh", "0svh"]);
  
  // Gradient slides up from below the screen (100vh) to 0, then continues up
  const transitionGradientY = useTransform(
    smoothProgress,
    [0.52, 0.70, 0.85, 1.0],
    ["100vh", "0vh", "-120vh", "-250vh"]
  );
  
  const transitionCtaOpacity = useTransform(smoothProgress, [0.70, 0.75, 0.90, 0.98], [0, 1, 1, 0]);

  const compactLogoScale = useTransform(smoothProgress, [0.15, 0.45], [1, 60]);
  const compactLogoY = useTransform(smoothProgress, [0, 1], ["0svh", "0svh"]);
  const compactLogoOpacity = useTransform(smoothProgress, [0.45, 0.52], [1, 0]);

  const navHref = (route: string) => {
    if (route === "news") return `/${lang}/news`;
    return localizedHref(route, lang);
  };

  return (
    <section ref={sectionRef} className="relative z-50 h-[250svh] w-full bg-black text-white">
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black">
        <motion.div
          data-homepage-gradient
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[400vh]"
          style={{
            y: transitionGradientY,
            background:
              "linear-gradient(180deg, #000000 0%, #000000 10%, #001015 20%, #002B36 30%, #28725F 45%, #75DAB4 65%, #F6F5F4 85%, #F6F5F4 100%)",
          }}
        />

        {/* Z-10: THE VIDEO CONTAINER */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
          style={{ opacity: videoContainerOpacity, scale: videoScale }}
        >
          <video
            ref={videoRef}
            src="/MotionMAWT.mp4"
            className="w-full h-full object-cover"
            playsInline
            muted
            loop
            preload="auto"
          />
        </motion.div>

        {/* Z-15: THE SVG HOLE MASK */}
        <motion.div 
          className="absolute inset-0 z-[15] pointer-events-none overflow-hidden"
          style={{ opacity: videoContainerOpacity }}
        >
          {/* Desktop Mask */}
          <div className="hidden lg:block absolute inset-0 mx-auto w-full max-w-[1760px]">
            <motion.h1
              className="absolute left-[2.5%] top-[6.5%] w-[95%]"
              style={{
                scale: heroLogoScale,
                transformOrigin: "53.23% 33.1%",
                opacity: heroLogoOpacity,
              }}
            >
              <MawatLogoMask className="h-auto w-full" />
            </motion.h1>
          </div>

          {/* Landscape Mobile Mask */}
          <div className="landscapeHero absolute inset-0 px-8 py-5 lg:hidden">
            <div className="relative h-full w-full">
              <motion.h1 className="absolute left-[2%] top-[5%] w-[82%]" style={{ scale: compactLogoScale, transformOrigin: "53.23% 33.1%", opacity: compactLogoOpacity }}>
                <MawatLogoMask className="h-auto w-full" />
              </motion.h1>
            </div>
          </div>

          {/* Portrait Mobile Mask */}
          <div className="portraitHero absolute inset-0 px-5 py-6 sm:px-7 sm:py-8 md:px-9 md:py-10 lg:hidden">
            <div className="w-full">
              <motion.h1 style={{ scale: compactLogoScale, transformOrigin: "53.23% 33.1%", opacity: compactLogoOpacity }}>
                <MawatLogoMask className="h-auto w-full max-w-[92vw] sm:max-w-[88vw] md:max-w-[82vw]" />
              </motion.h1>
            </div>
          </div>
        </motion.div>

        {/* Z-20: TEXT AND UI ELEMENTS */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: heroContentOpacity }}
        >
          {/* Desktop Text */}
          <div className="hidden lg:block relative h-full w-full max-w-[1760px] mx-auto">

            <motion.div className="absolute left-[2.5%] top-[62%]" style={{ y: desktopContentY }}>
              <GeometricSymbol className="h-[4.35cqw] w-[7.03cqw] max-h-[56px] max-w-[90px] text-white" />
            </motion.div>
            <motion.p className="absolute left-[2.5%] top-[74%] w-[43%] text-[2.45cqw] font-normal leading-[1.16] tracking-[-0.02em] text-white" style={{ y: desktopContentY }}>
              {dict.statement}
            </motion.p>
            <motion.div className="absolute left-[2.85%] top-[91.5%]" style={{ y: desktopContentY }}>
              <Link href={settings.ctaHref} className="pointer-events-auto inline-flex items-center text-[1.17cqw] font-normal leading-none text-white transition-colors hover:text-[#75DAB4]">
                <span aria-hidden="true" className="mr-[0.46875cqw]">→</span>
                {dict.cta}
              </Link>
            </motion.div>
            <motion.p className="absolute left-[65.5%] top-[74.4%] w-[30.5%] text-[1.17cqw] font-normal leading-[1.35] tracking-[-0.01em] text-white/74" style={{ y: desktopContentY }}>
              <span className="text-white">MAWT is a</span> <SwissMark /> {dict.description}
            </motion.p>
            <motion.ul className="absolute right-[2.5%] top-[91.5%] flex items-center gap-[1.5625cqw] pointer-events-auto" aria-label="Social links" style={{ y: desktopContentY }}>
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <Link href={href} target="_blank" rel="noreferrer" aria-label={label} className="pointer-events-auto flex h-[1.5625cqw] w-[1.5625cqw] items-center justify-center text-white transition-colors hover:text-[#75DAB4]">
                    <Icon className="h-[1.17cqw] w-[1.17cqw]" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Landscape Mobile Text */}
          <div className="landscapeHero absolute inset-0 px-8 py-5 lg:hidden">
            <div className="relative h-full w-full">
              <motion.div className="absolute left-[2%] top-[56%]" style={{ y: compactContentY }}>
                <GeometricSymbol className="h-7 w-[45px] text-white" />
              </motion.div>
              <motion.p className="absolute left-[2%] top-[65%] w-[48%] text-[clamp(1.2rem,3vw,1.55rem)] font-normal leading-[1.06] tracking-[-0.02em] text-white" style={{ y: compactContentY }}>
                {dict.statement}
              </motion.p>
              <motion.div className="absolute left-[6.5%] top-[88%]" style={{ y: compactContentY }}>
                <Link href={settings.ctaHref} className="pointer-events-auto inline-flex items-center text-[0.8125rem] font-normal leading-none text-white transition-colors hover:text-[#75DAB4]">
                  <span aria-hidden="true" className="mr-1.5">→</span>
                  {dict.cta}
                </Link>
              </motion.div>
              <motion.p className="absolute left-[59%] top-[68%] w-[38%] text-[0.8125rem] font-normal leading-[1.32] tracking-[-0.01em] text-white/74" style={{ y: compactContentY }}>
                <span className="text-white">MAWT is a</span> <SwissMark /> {dict.description}
              </motion.p>
              <motion.ul className="absolute right-[2%] top-[88%] flex items-center gap-4" aria-label="Social links" style={{ y: compactContentY }}>
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <li key={label}>
                    <Link href={href} target="_blank" rel="noreferrer" aria-label={label} className="pointer-events-auto flex h-5 w-5 items-center justify-center text-white transition-colors hover:text-[#75DAB4]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>

          {/* Portrait Mobile Text */}
          <div className="portraitHero absolute inset-0 flex flex-col justify-between px-5 py-6 sm:px-7 sm:py-8 md:px-9 md:py-10 lg:hidden">
            <div className="w-full" />
            <motion.div className="mt-auto flex flex-col gap-[clamp(1rem,3svh,2rem)] pt-5 sm:pt-8" style={{ y: compactContentY }}>
              <div>
                <GeometricSymbol className="h-[clamp(2rem,6vw,3.25rem)] w-[clamp(3.25rem,10vw,5.25rem)] text-white" />
              </div>
              <div className="grid gap-[clamp(1rem,3svh,1.75rem)] md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.8fr)] md:items-end md:gap-10">
                <div>
                  <p className="text-[clamp(1.35rem,7vw,2.25rem)] font-normal leading-[1.14] tracking-[-0.02em] text-white md:text-[clamp(1.75rem,4vw,2.4rem)]">
                    {dict.statement}
                  </p>
                  <div className="mt-[clamp(1rem,3svh,1.6rem)] inline-flex items-center">
                    <Link href={settings.ctaHref} className="pointer-events-auto text-[0.875rem] font-normal leading-none text-white transition-colors hover:text-[#75DAB4] sm:text-[0.9375rem]">
                      <span aria-hidden="true" className="mr-1.5">→</span>
                      {dict.cta}
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-[clamp(1rem,3svh,1.5rem)] md:items-start">
                  <p className="max-w-[26rem] text-[0.8125rem] font-normal leading-[1.35] tracking-[-0.01em] text-white/74 sm:text-[0.9375rem] md:max-w-none">
                    <span className="text-white">MAWT is a</span> <SwissMark /> {dict.description}
                  </p>
                  <ul className="flex items-center gap-4" aria-label="Social links">
                    {socialLinks.map(({ href, label, icon: Icon }) => (
                      <li key={label}>
                        <Link href={href} target="_blank" rel="noreferrer" aria-label={label} className="pointer-events-auto flex h-5 w-5 items-center justify-center text-white transition-colors hover:text-[#75DAB4]">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Z-30: GRADIENT TRANSITION TEXTS */}
        <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden px-5 sm:px-7 md:px-9 lg:block lg:px-[2.5vw]"
      >
        <div className="mx-auto w-full max-w-[1760px] pt-[28vh]">
          <HeroGradientStatement text={transitionDict.statement} progress={smoothProgress} />
          <motion.div
            className="mt-12"
            style={{ opacity: transitionCtaOpacity }}
          >
            <Link
              href={localizedHref("a-propos", lang)}
              className={`pointer-events-auto inline-flex h-10 items-center rounded-full border px-[22px] text-[13px] font-normal leading-none backdrop-blur-md transition-colors duration-300 ${transitionCtaClass}`}
            >
              {transitionDict.cta}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 px-5 sm:px-7 md:px-9 lg:hidden"
      >
        <div className="mx-auto w-full max-w-[48rem] pt-[28vh]">
          <HeroGradientStatement
            text={transitionDict.statement}
            progress={smoothProgress}
            className="text-[clamp(2rem,11vw,4rem)] leading-[1.03]"
          />
          <motion.div
            className="mt-8"
            style={{ opacity: transitionCtaOpacity }}
          >
            <Link
              href={localizedHref("a-propos", lang)}
              className={`pointer-events-auto inline-flex h-10 items-center rounded-full border px-[22px] text-[13px] font-normal leading-none backdrop-blur-md transition-colors duration-300 ${transitionCtaClass}`}
            >
              {transitionDict.cta}
            </Link>
          </motion.div>
        </div>
      </motion.div>

        {/* Z-50: NAVIGATION */}
        <motion.nav
          aria-label="Homepage transition navigation"
          className="absolute left-0 right-0 top-0 z-50 h-[71px] border-b border-transparent bg-transparent px-5 sm:px-7 md:px-9 lg:px-[2.5vw]"
          style={{ opacity: navbarOpacity, y: navbarY }}
        >
          <div className="mx-auto flex h-full w-full max-w-[1760px] items-center justify-between gap-5 md:gap-8">
            <motion.div style={{ opacity: navLogoOpacity }} className="shrink-0">
              <Link href={`/${lang}`} aria-label="MAWT home" className="block w-[98px]">
                <MawatLogo className="h-auto w-full" tone={isHomeNavLight ? "dark" : "light"} />
              </Link>
            </motion.div>

            <motion.div
              className={`ml-auto hidden flex-wrap items-center justify-end gap-x-5 gap-y-3 text-[13px] font-normal leading-none transition-colors duration-300 md:flex lg:gap-x-8 lg:text-[14px] ${homeNavTextClass}`}
              style={{ opacity: navLinksOpacity }}
            >
              {navItems.map((item) => (
                <Link key={item.route} href={navHref(item.route)} className={`transition-colors ${homeNavHoverClass}`}>
                  {item.label}
                </Link>
              ))}
              <span className={homeNavDividerClass}>—</span>
              <Link href="/fr" className={`transition-colors ${homeNavHoverClass} ${lang === "fr" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                FR
              </Link>
              <span className={homeNavSlashClass}>/</span>
              <Link href="/en" className={`transition-colors ${homeNavHoverClass} ${lang === "en" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                EN
              </Link>
            </motion.div>

            <motion.div
              className={`ml-auto flex items-center gap-3 text-[13px] font-normal leading-none transition-colors duration-300 md:hidden ${homeNavTextClass}`}
              style={{ opacity: navLinksOpacity }}
            >
              <Link href="/fr" className={`transition-colors ${homeNavHoverClass} ${lang === "fr" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                FR
              </Link>
              <span className={homeNavSlashClass}>/</span>
              <Link href="/en" className={`transition-colors ${homeNavHoverClass} ${lang === "en" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                EN
              </Link>
              <button
                type="button"
                aria-label={isHeroMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isHeroMobileMenuOpen}
                onClick={() => setIsHeroMobileMenuOpen((open) => !open)}
                className={`ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isHomeNavLight ? "bg-black/5 text-black" : "bg-white/10 text-white"}`}
              >
                {isHeroMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </motion.div>
          </div>
        </motion.nav>

        {isHeroMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
            className="fixed inset-0 z-[49] bg-black/94 px-6 pb-10 pt-[calc(env(safe-area-inset-top)+6rem)] text-white md:hidden"
          >
            <div className="flex flex-col gap-7">
              {navItems.map((item) => (
                <Link
                  key={item.route}
                  href={navHref(item.route)}
                  onClick={() => setIsHeroMobileMenuOpen(false)}
                  className="text-[clamp(2rem,10vw,3.35rem)] font-normal leading-none tracking-tight text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}

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
