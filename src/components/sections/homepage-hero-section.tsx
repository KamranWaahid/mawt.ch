"use client";

import { useId, useRef, useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { Menu, X } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { localizedHref, translatePath } from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";
import { AsciiWave } from "@/components/ui/ascii-wave";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { prefersNativeScroll } from "@/lib/scroll-environment";

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
  services?: unknown[];
};

// Scroll-scrubbed video intro: below OPEN the film is paused and the scroll
// position steps through its first SCRUB_SECONDS frame by frame (starting at
// SCRUB_START, when the logo reveal begins); playback only starts once the
// logo is fully "entered", so the opening of the film is never missed.
const VIDEO_SCRUB_START = 0.04;
// Playback starts the moment the video RECTANGLE is fully uncovered by the
// zooming logo (~0.18), not when the hole covers the whole screen (0.22) —
// a fully visible but frozen frame reads as a bug.
const VIDEO_OPEN_PROGRESS = 0.18;
const VIDEO_SCRUB_SECONDS = 3;

const HERO_VIDEO_DESKTOP = "/MotionMAWT.mp4";
const HERO_VIDEO_MOBILE = "/MotionMAWTMobile.mp4";

/** Portrait phones / narrow vertical viewports get the 9:16 mobile cut. */
function shouldUseMobileHeroVideo() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 && window.innerHeight > window.innerWidth;
}

const navItems = [
  { label: "Work", labelFr: "Projets", route: "projets" },
  { label: "Approach", labelFr: "Approche", route: "notre-methode" },
  { label: "Services", labelFr: "Services", route: "services" },
  { label: "News", labelFr: "Actualités", route: "news" },
  { label: "About", labelFr: "À propos", route: "a-propos" },
  { label: "Contact", labelFr: "Contact", route: "contact" },
];

const navItemLabel = (item: (typeof navItems)[number], lang: string) =>
  lang === "fr" ? item.labelFr : item.label;

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

/**
 * Swiss flag inline mark. `label` is what machines read in place of the flag:
 * "Swiss" completes the EN sentence ("MAWT is a Swiss studio for AI and
 * engineering in Geneva."), while in FR the flag is purely decorative and the
 * sentence must read whole without it ("MAWT est un studio d'IA et
 * d'ingénierie à Genève.") — injecting the English word produced
 * "MAWT est un Swiss studio…" for screen readers and text extractors.
 * The lead-in and hero.description are written to COMPOSE as one sentence;
 * keep them grammatical together when editing either side.
 */
function SwissMark({ label }: { label?: string }) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      className="mx-[0.3em] inline-flex h-[1.08em] w-[1.55em] translate-y-[0.16em] items-center justify-center align-baseline"
    >
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
      {label ? <span className="sr-only">{label}</span> : null}
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
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <svg
      viewBox="0 0 696 160"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {mawatLogoPaths.map((path, idx) => (
        <path key={`base-${path}`} d={path} fill={idx === 0 ? "#75DAB4" : (tone === "dark" ? "#050505" : "white")} />
      ))}
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
          <rect x="-30000" y="-30000" width="150000" height="80000" fill="white" />
          {mawatLogoPaths.map((path) => (
            <path key={`hole-${path}`} d={path} fill="black" />
          ))}
        </mask>
      </defs>
      <rect x="-30000" y="-30000" width="150000" height="80000" fill="black" mask={`url(#${maskId})`} />
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
  const start = 0.70 + index * 0.005;
  const end = Math.min(0.80, start + 0.05);
  
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);
  const blurValue = useTransform(progress, [start, end], [10, 0]);
  const filter = useTransform(blurValue, (b) => {
    if (b >= 9.99) return "none";
    if (b <= 0.01) return "none";
    return `blur(${b}px)`;
  });
  const visibility = useTransform(progress, (p) => p >= start ? "visible" : "hidden");

  return (
    <span className="inline">
      <motion.span
        initial={{ opacity: 0, visibility: "hidden" }}
        className="inline-block will-change-[transform,opacity,filter]"
        style={{
          opacity,
          y,
          filter,
          visibility,
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
  revealProgress,
  className = "",
}: {
  text: string;
  progress: MotionValue<number>;
  revealProgress: MotionValue<number>;
  className?: string;
}) {
  const words = text.split(" ");
  // Text transitions to dark when the light background reaches it, then fades
  // out BEFORE the clients panel (which overlaps the end of this track) can
  // slide up into it: with the ~48dvh overlap the panel reaches the statement
  // earlier, so the exit starts sooner than the old 0.945→0.98 window.
  // The exit fade follows LIVE progress (scrolling back up from the clients
  // panel must bring the statement back), while the reveal effects (word
  // blur-in + light→dark color) run on the LATCHED progress: once played they
  // never rewind on scroll-up — scrolling up just scrolls, and scrolling down
  // resumes the effect wherever it stopped.
  const exitOpacity = useTransform(progress, [0.925, 0.965], [1, 0]);
  const textColor = useTransform(revealProgress, [0.84, 0.91], ["#F6F5F4", "#000000"]);

  return (
    <motion.h2
      className={`max-w-[38rem] select-text font-serif text-[clamp(1.85rem,3.4vw,3.15rem)] font-normal leading-[1.18] tracking-[-0.015em] sm:max-w-[44rem] md:max-w-[52rem] ${className}`}
      style={{ opacity: exitOpacity, color: textColor }}
    >
      {words.map((word, index) => (
        <StatementWord
          key={`${word}-${index}`}
          word={word}
          index={index}
          total={words.length}
          progress={revealProgress}
        />
      ))}
    </motion.h2>
  );
}

export function HomepageHeroSection({ settings, dict, transitionDict, services }: HomepageHeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoWarmedRef = useRef(false);
  // Discrete UI flags only — never store continuous scroll in React state
  // (that re-rendered the whole hero every frame and janked mobile scroll).
  const [heroUi, setHeroUi] = useState({
    logoInteractive: true,
    asciiActive: true,
    navLight: false,
  });
  const [isHeroMobileMenuOpen, setIsHeroMobileMenuOpen] = useState(false);
  const [isAsciiVideoReady, setIsAsciiVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useMobileHeroVideo, setUseMobileHeroVideo] = useState(false);
  const [nativeScroll, setNativeScroll] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  useBodyScrollLock(isHeroMobileMenuOpen);
  const heroVideoSrc = useMobileHeroVideo ? HERO_VIDEO_MOBILE : HERO_VIDEO_DESKTOP;
  const params = useParams();
  const lang = (params?.lang === "fr" ? "fr" : "en") as Locale;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Lenis already smooths desktop wheel scroll, so the spring only needs a
  // light touch. Native/touch gets its own MUCH stiffer spring: raw touch
  // deltas arrive as discrete steps and made the logo dive visibly juddery,
  // while a loose spring on top of finger tracking reads as lag — the stiff
  // one only rounds off the steps.
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.0001,
  });
  const nativeSpringProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.0001,
  });
  const smoothProgress = nativeScroll ? nativeSpringProgress : springProgress;

  // One-way progress for the statement reveal (words + light→dark color):
  // it only ever advances, so scrolling back up never rewinds the effect —
  // the user just scrolls. It re-arms only back at the very top of the hero,
  // where the statement is long hidden, so the release itself is invisible.
  const statementRevealProgress = useMotionValue(0);
  useMotionValueEvent(smoothProgress, "change", (v) => {
    const prev = statementRevealProgress.get();
    if (v > prev || v < 0.05) {
      statementRevealProgress.set(v);
    }
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setHeroUi((prev) => {
      const next = {
        logoInteractive: latest < 0.03,
        asciiActive: latest < 0.68,
        navLight: latest >= 0.9,
      };
      if (
        prev.logoInteractive === next.logoInteractive &&
        prev.asciiActive === next.asciiActive &&
        prev.navLight === next.navLight
      ) {
        return prev;
      }
      return next;
    });

    const video = videoRef.current;
    if (video) {
      // One-shot warm-up on the first scroll movement: with
      // preload="metadata", iOS Safari decodes NO frame at all — the video
      // rendered as a black box through the whole cinema phase. A muted
      // playsInline play()+pause() (allowed without a gesture) forces the
      // first frame to decode long before the reveal, while still avoiding
      // the old eager 11 MB download at page load.
      if (
        !videoWarmedRef.current &&
        video.readyState < 2 && // no frame decoded yet (iOS with preload=metadata)
        latest > 0.005 &&
        latest < VIDEO_OPEN_PROGRESS
      ) {
        videoWarmedRef.current = true;
        const warm = video.play();
        if (warm) {
          warm
            .then(() => {
              video.pause();
              video.currentTime = 0;
            })
            .catch(() => {});
        }
      }
      if (latest < VIDEO_OPEN_PROGRESS) {
        // Reveal underway: hold playback and scrub. This handler already runs
        // at most once per frame (Motion batches scroll reads on rAF), so a
        // direct seek gated by a small delta is enough — no extra batching.
        // The !video.seeking guard matters under violent up/down scrolling:
        // without it a new seek is issued while the decoder is still working
        // on the previous one (measured ~23 seeks/s), and on weaker machines
        // that seek storm can stall the tab. One in-flight seek at a time
        // shows the same frames — you cannot display more than one seek per
        // frame anyway.
        if (!video.paused) video.pause();
        const scrubT = Math.min(
          1,
          Math.max(0, (latest - VIDEO_SCRUB_START) / (VIDEO_OPEN_PROGRESS - VIDEO_SCRUB_START)),
        );
        const target = scrubT * VIDEO_SCRUB_SECONDS;
        if (
          video.readyState >= 1 &&
          !video.seeking &&
          Math.abs(video.currentTime - target) > 0.04
        ) {
          video.currentTime = target;
        }
      } else if (video.paused) {
        // Fully entered the logo: let the film run from where the scrub left it.
        video.play().catch(() => {});
      }
    }
  });

  useEffect(() => {
    // AsciiWave may have signalled readiness BEFORE this effect subscribed
    // (child effects run first; a cached image makes its init synchronous).
    // Missing that one-shot event left the ASCII layer at opacity 0 — a
    // fully black hero. The window flag covers the late-subscriber case.
    if ((window as unknown as { __asciiWaveReady?: boolean }).__asciiWaveReady) {
      setIsAsciiVideoReady(true);
      return;
    }
    const handleAsciiReady = () => setIsAsciiVideoReady(true);
    window.addEventListener('ascii-wave-ready', handleAsciiReady);
    return () => window.removeEventListener('ascii-wave-ready', handleAsciiReady);
  }, []);

  // After a mid-page refresh the browser restores the scroll position, but
  // that measurement can fire before the spring is attached: every
  // smooth-driven layer then sits parked at 0 until the next real scroll
  // ("the logo arrives after I scroll"). Jump the spring to the first
  // measured value; afterwards it tracks normally.
  useEffect(() => {
    const sync = (v: number) => {
      // Jump both springs — whichever drives visuals must not animate from 0.
      springProgress.jump(v);
      nativeSpringProgress.jump(v);
      statementRevealProgress.set(v);
      setHeroUi({
        logoInteractive: v < 0.03,
        asciiActive: v < 0.68,
        navLight: v >= 0.9,
      });
      // Refreshing straight into the cinema phase must also start the film.
      const video = videoRef.current;
      if (video && v >= VIDEO_OPEN_PROGRESS && video.paused) {
        video.play().catch(() => {});
      }
    };
    if (Math.abs(scrollYProgress.get() - springProgress.get()) > 0.001) {
      sync(scrollYProgress.get());
      return;
    }
    let unsub: VoidFunction | null = scrollYProgress.on("change", (v) => {
      sync(v);
      unsub?.();
      unsub = null;
    });
    const timeout = window.setTimeout(() => {
      unsub?.();
      unsub = null;
    }, 3000);
    return () => {
      window.clearTimeout(timeout);
      unsub?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    setNativeScroll(prefersNativeScroll());
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setNativeScroll(prefersNativeScroll());
      const nextUseMobile = shouldUseMobileHeroVideo();
      setUseMobileHeroVideo((prev) => {
        if (prev !== nextUseMobile) {
          // Source swap remounts decode state — allow the iOS warm-up again.
          videoWarmedRef.current = false;
        }
        return nextUseMobile;
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Camera-dive keyframes: the scale grows GEOMETRICALLY (×~8-12 per step) so
  // the perceived zoom speed stays constant — that's what reads as "flying
  // through the logo" instead of "the logo gets closer". Translates keep the
  // dive point (inside the letterforms) locked toward screen centre. One set
  // of keyframes for both scroll directions: reversing simply plays the dive
  // backwards (the old direction-switch snapped mid-transition).
  // The dive begins at 4% of the track (it used to wait until 10%, which
  // felt like having to scroll too far before the logo reacted).
  const heroLogoTransformDesktop = useTransform(smoothProgress, [0, 0.04, 0.10, 0.16, 0.22, 0.50], [
    "translate(calc(0vw - 0px), calc(0vh - 0px)) scale(1)",
    "translate(calc(0vw - 0px), calc(0vh - 0px)) scale(1)",
    "translate(calc(47.5vw - 588px), calc(40vh - 159.25px)) scale(12)",
    "translate(calc(47.5vw - 2574px), calc(46vh - 981px)) scale(85)",
    "translate(calc(47.5vw - 21193px), calc(50vh - 7909px)) scale(700)",
    "translate(calc(47.5vw - 21193px), calc(50vh - 7909px)) scale(700)"
  ]);

  const heroLogoTransformLandscape = useTransform(smoothProgress, [0, 0.04, 0.10, 0.16, 0.22, 0.50], [
    "translate(calc(0vw - 0px), calc(0vh - 0px)) scale(1)",
    "translate(calc(0vw - 0px), calc(0vh - 0px)) scale(1)",
    "translate(calc(50vw - 318px), calc(40vh - 91.75px)) scale(6)",
    "translate(calc(50vw - 1970px), calc(46vh - 733px)) scale(65)",
    "translate(calc(50vw - 21217px), calc(50vh - 7909px)) scale(700)",
    "translate(calc(50vw - 21217px), calc(50vh - 7909px)) scale(700)"
  ]);

  const heroLogoTransformPortrait = useTransform(smoothProgress, [0, 0.04, 0.10, 0.16, 0.22, 0.50], [
    "translate(calc(0vw - 0px), calc(0vh - 0px)) scale(1)",
    "translate(calc(0vw - 0px), calc(0vh - 0px)) scale(1)",
    "translate(calc(50vw - 191.5px), calc(40vh - 63.675px)) scale(3.5)",
    "translate(calc(50vw - 1515px), calc(46vh - 564px)) scale(50)",
    "translate(calc(50vw - 21213px), calc(50vh - 7909px)) scale(700)",
    "translate(calc(50vw - 21213px), calc(50vh - 7909px)) scale(700)"
  ]);

  // The hole-mask + video layers sit ABOVE the persistent ASCII field.
  // The plate outside the logo hole stops at 80% opacity during the reveal —
  // the ASCII field stays faintly visible around the logo instead of blacking
  // out — and only goes fully opaque once the hole has almost swallowed the
  // screen, so the video never ghosts through it at cruising speed. The video
  // itself fades in later (0.13-0.18), once the hole is big enough that its
  // faint pre-glow through the 80% plate reads as intentional.
  const maskCoverOpacityDown = useTransform(smoothProgress, [0.04, 0.10], [1, 0]);
  // The dim starts almost immediately (1.5% of the track) so the very first
  // wheel tick produces visible feedback — the old 5% threshold left a dead
  // zone where scrolling did nothing, which read as input lag.
  // The cinema hold (video fully revealed, film playing) runs 0.19 → 0.55 of
  // the pinned track — over a full viewport of scroll. One flick can no
  // longer blow straight through the video into the gradient: the user has
  // to scroll again to move on.
  const maskLayerOpacityDown = useTransform(
    smoothProgress,
    [0.015, 0.05, 0.14, 0.19, 0.55, 0.65],
    [0, 0.8, 0.8, 1, 1, 0],
  );
  const heroLogoOpacityDown = useTransform(smoothProgress, [0.55, 0.65], [1, 0]);
  const videoContainerOpacityDown = useTransform(smoothProgress, [0.08, 0.13, 0.55, 0.65], [0, 1, 1, 0]);
  // The nav logo takes over as soon as the hero logo mark has faded,
  // so logo + menu frame the video during the cinema-mode phase.
  const navLogoOpacityDown = useTransform(smoothProgress, [0.12, 0.20], [0, 1]);

  // One curve per layer for both scroll directions: the old direction switch
  // (logo locked at scale 700 on the way up) snapped hard when the user
  // reversed mid-transition, and any semi-transparent frame over the ASCII
  // field shows glyphs through the picture.
  const maskCoverOpacity = maskCoverOpacityDown;
  const heroLogoOpacity = heroLogoOpacityDown;
  const videoContainerOpacity = videoContainerOpacityDown;
  const maskLayerOpacity = maskLayerOpacityDown;
  const navLogoOpacity = navLogoOpacityDown;

  // Depth parallax: while the letterforms blow past the camera, the scene
  // behind grows from 86% to full size — the speed difference between the
  // two planes is what sells "entering" over "approaching".
  const videoScale = useTransform(smoothProgress, [0.08, 0.23], [0.86, 1]);
  // Reduced motion no longer hides the ASCII art: the canvas simply stops
  // flickering (AsciiWave's `active` prop), so the wave shows as a still.
  // The field stays behind everything while scrolling and only fades once the
  // gradient transition sweeps up to cover it (~0.55 on the scroll track).
  const asciiFadeOpacity = useTransform(smoothProgress, [0.57, 0.67], [1, 0]);
  const asciiLayerOpacity = isAsciiVideoReady ? asciiFadeOpacity : 0;
  const asciiLayerVisibility = isAsciiVideoReady && heroUi.asciiActive ? "visible" : "hidden";
  // Past the cinema phase every logo/mask/video layer is at opacity 0 but was
  // still LAYERIZED: the ×700-scaled logo svgs are ~68000px wide — beyond GPU
  // texture limits — and mobile compositors render such stale layers as solid
  // BLACK BARS (the "black bar before the client logos"). visibility:hidden
  // drops them from the layer tree entirely once they are invisible.
  const cinemaLayersVisibility = useTransform(smoothProgress, (p) =>
    p < 0.66 ? "visible" : "hidden",
  );
  const heroContentOpacity = useTransform(smoothProgress, [0.04, 0.10], [1, 0]);
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0.45, 0.50], [1, 0]);

  const isHomeNavLight = heroUi.navLight;
  const homeNavTextClass = isHomeNavLight ? "text-black/70" : "text-white/72";
  const homeNavDividerClass = isHomeNavLight ? "text-black/25" : "text-white/25";
  const homeNavSlashClass = isHomeNavLight ? "text-black/45" : "text-white/45";
  const isTransitionTextDark = heroUi.navLight;
  const transitionCtaClass = isTransitionTextDark
    ? "border-black/12 bg-black/[0.04] text-black/92"
    : "border-white/14 bg-white/[0.10] text-white/92";
    

  const desktopContentY = useTransform(smoothProgress, [0, 1], ["0svh", "0svh"]);
  const compactContentY = useTransform(smoothProgress, [0, 1], ["0svh", "0svh"]);
  
  // Gradient slides up from below the screen (100vh) to 0, then continues up.
  // It is fully beige by 0.94 — the clients section overlaps the last
  // ~48dvh of this track (page.tsx negative margin), so the gradient must be
  // done before that panel slides in over it.
  const transitionGradientY = useTransform(
    scrollYProgress,
    [0.60, 0.70, 0.84, 0.94],
    ["100vh", "0vh", "-150vh", "-300vh"]
  );

  const transitionCtaOpacity = useTransform(scrollYProgress, [0.76, 0.83, 0.90, 0.95], [0, 1, 1, 0]);
  const transitionCtaVisibility = useTransform(scrollYProgress, (p) => p >= 0.70 && p <= 0.96 ? "visible" : "hidden");

  // With the reveal latched, the words would stay painted over the cinema
  // phase when scrolling back up — this LIVE gate keeps the whole statement
  // block tied to the gradient sweep (which enters the screen around 0.64):
  // scrolling up past it, the black text sinks into the dark top of the
  // gradient and the block unmounts from paint below 0.64.
  const statementGateOpacity = useTransform(scrollYProgress, (p) =>
    p >= 0.68 ? 1 : p <= 0.64 ? 0 : (p - 0.64) / 0.04,
  );
  const statementGateVisibility = useTransform(scrollYProgress, (p) =>
    p >= 0.64 ? "visible" : "hidden",
  );

  const navHref = (route: string) => {
    if (route === "news") return `/${lang}/${lang === "fr" ? "blog" : "news"}`;
    return localizedHref(route, lang);
  };

  // Sanity stores a raw path ("/contact"): localize it, otherwise every CTA
  // click goes through the Accept-Language 307 and can land FR users on /en.
  const ctaHref = translatePath(`/en${settings.ctaHref.startsWith("/") ? settings.ctaHref : `/${settings.ctaHref}`}`, "en", lang);

  return (
    <section
      ref={sectionRef}
      className="home-hero-root relative z-50 h-[400dvh] w-full text-white"
      // Black for the pinned 3/4, beige for the unpin tail: on mobile the
      // URL-bar collapse resizes every dvh height mid-scroll and the section's
      // own background peeks out at the seam with the next section — it must
      // already be beige there, not black (the "black bar" above the logos).
      style={{
        background:
          "linear-gradient(180deg, #000000 0%, #000000 72%, #F6F5F4 76%, #F6F5F4 100%)",
      }}
    >
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-black">
        <motion.div
          data-homepage-gradient
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[400dvh]"
          style={{
            y: transitionGradientY,
            background:
              "linear-gradient(180deg, #000000 0%, #000000 10%, #001015 20%, #002B36 30%, #28725F 45%, #75DAB4 58%, #D5FFEF 66%, #F6F5F4 75%, #F6F5F4 100%)",
          }}
        />

        {/* Z-10: CINEMA MODE VIDEO CONTAINER — revealed through the zooming
            logo hole (z-15 mask). The overlay sits BEHIND the video: it dims
            the ASCII field around it while the video itself stays fully
            opaque. Nav logo + menu (z-50) stay lit above everything. */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
          style={{ opacity: videoContainerOpacity, visibility: cinemaLayersVisibility }}
        >
          <div className="absolute inset-0 bg-black/80" />
          {/* The parallax scale lives on the video itself, NOT the container:
              scaling the container would shrink the full-screen dim overlay
              and leave undimmed bands at the screen edges. */}
          <motion.video
            key={heroVideoSrc}
            ref={videoRef}
            src={heroVideoSrc}
            className={
              useMobileHeroVideo
                ? "home-hero-top-video relative h-[72dvh] max-h-[720px] w-auto max-w-[86vw] aspect-[9/16] object-cover shadow-2xl"
                : "home-hero-top-video relative w-[82vw] max-w-[820px] aspect-video object-cover shadow-2xl"
            }
            style={{ scale: videoScale }}
            playsInline
            muted
            loop
            // metadata, not auto: the full file is 11 MB and the video is only
            // revealed on scroll — an eager download competed with JS/fonts during the
            // LCP phase. Metadata alone (a few KB) is enough for the scroll
            // scrub (readyState >= 1); the browser then streams the segments
            // it needs the moment currentTime is first set.
            preload="metadata"
          />
        </motion.div>

        {/* Z-8: PERSISTENT ASCII FIELD — lives under the video/mask stack so
            the cinema overlay dims it and the logo hole reveals it. */}
        <motion.div
          aria-hidden="true"
          className="home-hero-ascii-layer pointer-events-none absolute inset-0 z-[8] overflow-hidden"
          style={{ opacity: asciiLayerOpacity, visibility: asciiLayerVisibility }}
        >
          <div className="ascii-wave-viewport">
            <AsciiWave
              src="/hero-ascii-map.jpg"
              active={heroUi.asciiActive}
              focusX={isMobile ? 0.35 : 0.5}
              focusY={isMobile ? 0.6 : 0.68}
              className="ascii-wave-canvas"
            />
          </div>
        </motion.div>

        {/* Visible logo mark above the pre-scroll ASCII layer. A plain anchor
            (full page load, the "click the logo to refresh" reflex) while the
            hero is at rest; it stops being clickable once the zoom starts. */}
        <div className="pointer-events-none absolute inset-0 z-[18] overflow-hidden">
          <div className="hidden lg:block absolute inset-0">
            <motion.div
              className="absolute left-5 top-[23px] sm:left-7 md:left-9 lg:left-[2.5vw] block"
              style={{
                width: "98px",
                transform: heroLogoTransformDesktop,
                transformOrigin: "top left",
                // NO willChange here: with will-change:transform Chrome keeps a
                // persistent texture and rasterizes this layer at its animated
                // scale (up to x700) — on real GPUs that HARD-FREEZES the
                // renderer within the first wheel ticks (reproduced 100% via
                // CDP stress; removing will-change survives the same stress).
                opacity: heroLogoOpacity,
                visibility: cinemaLayersVisibility,
              }}
            >
              <motion.div className="absolute inset-0" style={{ opacity: maskCoverOpacity }}>
                <a
                  href={`/${lang}`}
                  aria-label="MAWT home"
                  className="block"
                  style={{ pointerEvents: heroUi.logoInteractive ? "auto" : "none" }}
                >
                  <MawatLogo className="h-auto w-full" tone="light" />
                </a>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute inset-0 hidden max-lg:landscape:block">
            <motion.div
              className="absolute left-5 top-[23px] sm:left-7 md:left-9 lg:left-[2.5vw] block"
              style={{
                width: "98px",
                transform: heroLogoTransformLandscape,
                transformOrigin: "top left",
                // NO willChange here: with will-change:transform Chrome keeps a
                // persistent texture and rasterizes this layer at its animated
                // scale (up to x700) — on real GPUs that HARD-FREEZES the
                // renderer within the first wheel ticks (reproduced 100% via
                // CDP stress; removing will-change survives the same stress).
                opacity: heroLogoOpacity,
                visibility: cinemaLayersVisibility,
              }}
            >
              <motion.div className="absolute inset-0" style={{ opacity: maskCoverOpacity }}>
                <a
                  href={`/${lang}`}
                  aria-label="MAWT home"
                  className="block"
                  style={{ pointerEvents: heroUi.logoInteractive ? "auto" : "none" }}
                >
                  <MawatLogo className="h-auto w-full" tone="light" />
                </a>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute inset-0 hidden max-lg:portrait:block">
            <motion.div
              className="absolute left-5 top-[23px] sm:left-7 md:left-9 lg:left-[2.5vw] block"
              style={{
                width: "98px",
                transform: heroLogoTransformPortrait,
                transformOrigin: "top left",
                // NO willChange here: with will-change:transform Chrome keeps a
                // persistent texture and rasterizes this layer at its animated
                // scale (up to x700) — on real GPUs that HARD-FREEZES the
                // renderer within the first wheel ticks (reproduced 100% via
                // CDP stress; removing will-change survives the same stress).
                opacity: heroLogoOpacity,
                visibility: cinemaLayersVisibility,
              }}
            >
              <motion.div className="absolute inset-0" style={{ opacity: maskCoverOpacity }}>
                <a
                  href={`/${lang}`}
                  aria-label="MAWT home"
                  className="block"
                  style={{ pointerEvents: heroUi.logoInteractive ? "auto" : "none" }}
                >
                  <MawatLogo className="h-auto w-full" tone="light" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Z-15: THE SVG HOLE MASK */}
        <motion.div
          className="absolute inset-0 z-[15] pointer-events-none overflow-hidden"
          style={{ opacity: maskLayerOpacity, visibility: cinemaLayersVisibility }}
        >
          {/* Desktop Mask */}
          <div className="hidden lg:block absolute inset-0">
            <motion.div
              className="absolute left-5 top-[23px] sm:left-7 md:left-9 lg:left-[2.5vw] z-40 block"
              style={{
                width: "98px",
                transform: heroLogoTransformDesktop,
                transformOrigin: "top left",
                // NO willChange here: with will-change:transform Chrome keeps a
                // persistent texture and rasterizes this layer at its animated
                // scale (up to x700) — on real GPUs that HARD-FREEZES the
                // renderer within the first wheel ticks (reproduced 100% via
                // CDP stress; removing will-change survives the same stress).
                opacity: heroLogoOpacity,
                overflow: "visible",
              }}
            >
              <MawatLogoMask className="h-auto w-full" />
              <motion.div className="absolute inset-0 z-[20]" style={{ opacity: maskCoverOpacity }}>
                <MawatLogo className="h-auto w-full" tone="light" />
              </motion.div>
            </motion.div>
          </div>

          {/* Landscape Mobile Mask */}
          <div className="absolute inset-0 hidden max-lg:landscape:block">
            <motion.div
              className="absolute left-5 top-[23px] sm:left-7 md:left-9 lg:left-[2.5vw] z-40 block"
              style={{
                width: "98px",
                transform: heroLogoTransformLandscape,
                transformOrigin: "top left",
                // NO willChange here: with will-change:transform Chrome keeps a
                // persistent texture and rasterizes this layer at its animated
                // scale (up to x700) — on real GPUs that HARD-FREEZES the
                // renderer within the first wheel ticks (reproduced 100% via
                // CDP stress; removing will-change survives the same stress).
                opacity: heroLogoOpacity,
                overflow: "visible",
              }}
            >
              <MawatLogoMask className="h-auto w-full" />
              <motion.div className="absolute inset-0 z-[20]" style={{ opacity: maskCoverOpacity }}>
                <MawatLogo className="h-auto w-full" tone="light" />
              </motion.div>
            </motion.div>
          </div>

          {/* Portrait Mobile Mask */}
          <div className="absolute inset-0 hidden max-lg:portrait:block">
            <motion.div
              className="absolute left-5 top-[23px] sm:left-7 md:left-9 lg:left-[2.5vw] z-40 block"
              style={{
                width: "98px",
                transform: heroLogoTransformPortrait,
                transformOrigin: "top left",
                // NO willChange here: with will-change:transform Chrome keeps a
                // persistent texture and rasterizes this layer at its animated
                // scale (up to x700) — on real GPUs that HARD-FREEZES the
                // renderer within the first wheel ticks (reproduced 100% via
                // CDP stress; removing will-change survives the same stress).
                opacity: heroLogoOpacity,
                overflow: "visible",
              }}
            >
              <MawatLogoMask className="h-auto w-full" />
              <motion.div className="absolute inset-0 z-[20]" style={{ opacity: maskCoverOpacity }}>
                <MawatLogo className="h-auto w-full" tone="light" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Z-20: TEXT AND UI ELEMENTS */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: heroContentOpacity }}
        >
          {/* Desktop Text */}
          <div className="hidden lg:block relative h-full w-full">
            {/* Symbol + statement are bottom-anchored (like the CTA) so the
                gap above "Engager la conversation" stays constant however many
                lines the statement wraps to on short viewports. */}
            <motion.div className="absolute left-[2.5vw] bottom-[34%]" style={{ y: desktopContentY }}>
              <GeometricSymbol className="h-[4.35cqw] w-[7.03cqw] max-h-[56px] max-w-[90px] text-white" />
            </motion.div>
            <motion.p className="absolute left-[2.5vw] bottom-[13%] w-[43%] text-[2.45cqw] font-normal leading-[1.16] tracking-[-0.02em] text-white" style={{ y: desktopContentY }}>
              {dict.statement}
            </motion.p>
            <motion.div className="absolute left-[2.5vw] bottom-[6%]" style={{ y: desktopContentY }}>
              <Link href={ctaHref} className="pointer-events-auto inline-flex items-center text-[1.17cqw] font-normal leading-none text-white">
                <span aria-hidden="true" className="mr-[0.46875cqw]">→</span>
                {dict.cta}
              </Link>
            </motion.div>
            {/* data-nosnippet: this paragraph exists 3× in the SSR HTML (one
                per responsive hero variant) — only the portrait/mobile copy
                (mobile-first indexing) stays extractable, so snippets and AI
                answers read the SEO paragraph exactly once. */}
            <motion.p data-nosnippet className="absolute right-[2.5vw] bottom-[6%] w-[30.5%] text-[1.17cqw] font-normal leading-[1.35] tracking-[-0.01em] text-white/74" style={{ y: desktopContentY }}>
              <span className="text-white">{lang === "fr" ? "MAWT est un" : "MAWT is a"}</span> <SwissMark label={lang === "fr" ? undefined : "Swiss"} /> {dict.description}
            </motion.p>
          </div>

          {/* Landscape Mobile Text */}
          <div className="absolute inset-0 px-8 py-5 hidden max-lg:landscape:block">
            <div className="relative h-full w-full">
              <motion.div className="absolute left-[2%] bottom-[46%]" style={{ y: compactContentY }}>
                <GeometricSymbol className="h-7 w-[45px] text-white" />
              </motion.div>
              <motion.p className="absolute left-[2%] bottom-[20%] w-[48%] text-[clamp(1.2rem,3vw,1.55rem)] font-normal leading-[1.06] tracking-[-0.02em] text-white" style={{ y: compactContentY }}>
                {dict.statement}
              </motion.p>
              <motion.div className="absolute left-[6.5%] bottom-[10%]" style={{ y: compactContentY }}>
                <Link href={ctaHref} className="pointer-events-auto inline-flex items-center text-[0.8125rem] font-normal leading-none text-white">
                  <span aria-hidden="true" className="mr-1.5">→</span>
                  {dict.cta}
                </Link>
              </motion.div>
              <motion.p data-nosnippet className="absolute left-[59%] bottom-[10%] w-[38%] text-[0.8125rem] font-normal leading-[1.32] tracking-[-0.01em] text-white/74" style={{ y: compactContentY }}>
                <span className="text-white">{lang === "fr" ? "MAWT est un" : "MAWT is a"}</span> <SwissMark label={lang === "fr" ? undefined : "Swiss"} /> {dict.description}
              </motion.p>
            </div>
          </div>

          {/* Portrait Mobile Text */}
          <div className="absolute inset-0 flex-col justify-between px-5 pt-6 pb-[8vh] max-sm:pb-[8vh] sm:px-7 sm:pt-8 md:px-9 md:pt-10 hidden max-lg:portrait:flex">
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
                    <Link href={ctaHref} className="pointer-events-auto text-[0.875rem] font-normal leading-none text-white sm:text-[0.9375rem]">
                      <span aria-hidden="true" className="mr-1.5">→</span>
                      {dict.cta}
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-[clamp(1rem,3svh,1.5rem)] md:items-start">
                  {/* Canonical (extractable) instance of the SEO paragraph —
                      the desktop/landscape twins carry data-nosnippet. */}
                  <p className="max-w-[26rem] text-[0.8125rem] font-normal leading-[1.35] tracking-[-0.01em] text-white/74 sm:text-[0.9375rem] md:max-w-none">
                    <span className="text-white">{lang === "fr" ? "MAWT est un" : "MAWT is a"}</span> <SwissMark label={lang === "fr" ? undefined : "Swiss"} /> {dict.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Z-25: SCROLL INDICATOR */}
        <motion.div 
          className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-25 animate-bounce"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>

        {/* Z-30: GRADIENT TRANSITION TEXTS — site-container keeps the left edge
            aligned with the clients logos that follow, so the handoff reads as
            one editorial column instead of two unrelated blocks. */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden lg:block"
          style={{ opacity: statementGateOpacity, visibility: statementGateVisibility }}
        >
          <div className="site-container pt-[clamp(5.5rem,16vh,9.5rem)]">
            <HeroGradientStatement
              text={transitionDict.statement}
              progress={smoothProgress}
              revealProgress={statementRevealProgress}
            />
            <motion.div
              initial={{ opacity: 0, visibility: "hidden" }}
              className="mt-8"
              style={{ opacity: transitionCtaOpacity, visibility: transitionCtaVisibility }}
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
          className="pointer-events-none absolute inset-x-0 top-0 z-30 lg:hidden"
          style={{ opacity: statementGateOpacity, visibility: statementGateVisibility }}
        >
          <div className="site-container pt-[clamp(4.5rem,14vh,7.5rem)]">
            <HeroGradientStatement
              text={transitionDict.statement}
              progress={smoothProgress}
              revealProgress={statementRevealProgress}
              className="text-[clamp(1.75rem,8.5vw,2.75rem)] leading-[1.16]"
            />
            <motion.div
              initial={{ opacity: 0, visibility: "hidden" }}
              className="mt-7"
              style={{ opacity: transitionCtaOpacity, visibility: transitionCtaVisibility }}
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
        >
          <div className="mx-auto flex h-full w-full max-w-[1760px] items-center justify-between gap-5 md:gap-8">
            <motion.div style={{ opacity: navLogoOpacity }} className="shrink-0">
              {/* Plain anchor, not a Next Link: clicking the logo while already
                  on the homepage must do a full reload (Link to the current
                  route is a no-op), which also replays the intro. */}
              <a href={`/${lang}`} aria-label="MAWT home" className="block w-[98px]">
                <MawatLogo className="h-auto w-full" tone={isHomeNavLight ? "dark" : "light"} />
              </a>
            </motion.div>

            <motion.div
              className={`ml-auto hidden flex-wrap items-center justify-end gap-x-5 gap-y-3 text-[13px] font-normal leading-none transition-colors duration-300 md:flex lg:gap-x-8 lg:text-[14px] ${homeNavTextClass}`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.route}
                  href={navHref(item.route)}
                  className="transition-colors"
                >
                  {navItemLabel(item, lang)}
                </Link>
              ))}
              <span className={homeNavDividerClass}>—</span>
              <Link href="/fr" className={`transition-colors ${lang === "fr" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                FR
              </Link>
              <span className={homeNavSlashClass}>/</span>
              <Link href="/en" className={`transition-colors ${lang === "en" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                EN
              </Link>
            </motion.div>

            <motion.div
              className={`ml-auto flex items-center gap-3 text-[13px] font-normal leading-none transition-colors duration-300 md:hidden ${homeNavTextClass}`}
            >
              <Link href="/fr" className={`transition-colors ${lang === "fr" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                FR
              </Link>
              <span className={homeNavSlashClass}>/</span>
              <Link href="/en" className={`transition-colors ${lang === "en" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
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

        {/* Same motion language as the site header's mobile menu: blur-fade
            overlay with AnimatePresence exit, staggered link reveal. */}
        <AnimatePresence>
          {isHeroMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="fixed inset-0 z-[49] bg-black/94 px-6 pb-10 pt-[calc(env(safe-area-inset-top)+6rem)] text-white md:hidden"
            >
              <motion.div
                className="flex flex-col gap-7"
                initial="initial"
                animate="animate"
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.2,
                    },
                  },
                }}
              >
                {navItems.map((item) => (
                  <motion.div
                    key={item.route}
                    variants={{
                      initial: { opacity: 0, x: -20, filter: "blur(10px)" },
                      animate: { opacity: 1, x: 0, filter: "blur(0px)" },
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Link
                      href={navHref(item.route)}
                      onClick={() => setIsHeroMobileMenuOpen(false)}
                      className="text-[clamp(2rem,10vw,3.35rem)] font-normal leading-none tracking-tight text-white"
                    >
                      {navItemLabel(item, lang)}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </section>
  );
}
