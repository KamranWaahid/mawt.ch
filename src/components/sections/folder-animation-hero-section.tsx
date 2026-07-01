"use client";

import gsap from "gsap";
import Link from "next/link";
// Aliased: the hero uses the browser-global `new Image()` for canvas frames,
// so next/image must not shadow it.
import { useGSAP } from "@gsap/react";
import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";
import { motion, useTransform, useMotionValue, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { Reveal } from "@/components/ui/reveal";
import type { SiteSettings } from "@/lib/types";

gsap.registerPlugin(useGSAP);

type FolderAnimationHeroSectionProps = {
  settings: SiteSettings;
  visual?: ReactNode;
  visualSrc?: string;
  visualAlt?: string;
};

type HeroCopy = {
  kicker: string;
  title_1: string;
  title_2: string;
  description: string;
  summary?: string;
  cta: string;
};

const socialLinks = [
  { href: "https://facebook.com/mawt.ch", label: "Facebook", icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.388 14.185 5 15.324 5H18V0h-4.152C9.423 0 9 1.923 9 4.915V8z"/></svg>
  )},
  { href: "https://x.com/mawt.ch", label: "X", icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.18l4.73 6.26L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
  )},
  { href: "https://instagram.com/mawt.ch", label: "Instagram", icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  )},
  { href: "https://linkedin.com/company/mawt.ch", label: "LinkedIn", icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
  )},
];

const GeometricSymbol = () => (
  <svg width="71" height="44" viewBox="0 0 71 44" fill="none" className="hero-kicker mb-4 lg:mb-6 opacity-80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35.2503" cy="21.5827" r="16.8204" stroke="white" strokeWidth="0.891184"/>
    <circle cx="21.5825" cy="21.5825" r="21.1369" stroke="white" strokeWidth="0.891184"/>
    <circle cx="48.9204" cy="21.5825" r="21.1369" stroke="white" strokeWidth="0.891184"/>
    <line y1="21.137" x2="70.5027" y2="21.1371" stroke="white" strokeWidth="0.891184"/>
    <line x1="9.60113" y1="3.94763" x2="60.6796" y2="38.4796" stroke="white" strokeWidth="0.891184"/>
    <line y1="-0.445592" x2="61.656" y2="-0.445592" transform="matrix(-0.828443 0.560074 0.560074 0.828443 60.4336 4.31677)" stroke="white" strokeWidth="0.891184"/>
  </svg>
);

const totalFrames = 241;
const getFrameUrl = (index: number) => {
  return `/HeroImages/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;
};

function drawImageProp(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const canvas = ctx.canvas;
  const imgWidth = img.naturalWidth || img.width;
  const imgHeight = img.naturalHeight || img.height;
  
  const wr = canvas.width / imgWidth;
  const hr = canvas.height / imgHeight;
  
  const isPortrait = canvas.width < canvas.height;
  
  let r = Math.max(wr, hr);
  let x = 0;
  let y = 0;
  
  if (isPortrait) {
    // Mobile/Portrait: Scale up to fill blank space and center the hand/folder (shifted slightly right to center it visually)
    r = wr * 1.6;
    const w = imgWidth * r;
    const h = imgHeight * r;
    x = canvas.width / 2 - 0.57 * w;
    // Push it towards the bottom of the viewport with a small margin (30px)
    y = canvas.height - h - 30;
  } else {
    // Desktop/Landscape: Keep cover scale and shift slightly right
    const w = imgWidth * r;
    const h = imgHeight * r;
    let alignX = 0.5;
    if (canvas.width > 768) {
      alignX = 0.65;
    }
    x = (canvas.width - w) * alignX;
    y = (canvas.height - h) / 2;
  }
  
  const w = imgWidth * r;
  const h = imgHeight * r;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y, w, h);
}

export function FolderAnimationHeroSection({ settings, dict }: FolderAnimationHeroSectionProps & { dict: HeroCopy }) {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [showTransitionStatement, setShowTransitionStatement] = useState(false);
  
  const progressValue = useMotionValue(0);
  const transitionProgressValue = useMotionValue(0);
  const gradientProgressValue = useMotionValue(0);
  const smoothProgress = useSpring(progressValue, {
    stiffness: 150,
    damping: 25,
    mass: 0.2,
    restDelta: 0.001
  });
  const smoothTransitionProgress = useSpring(transitionProgressValue, {
    stiffness: 120,
    damping: 28,
    mass: 0.25,
    restDelta: 0.001
  });
  const smoothGradientProgress = useSpring(gradientProgressValue, {
    stiffness: 120,
    damping: 30,
    mass: 0.25,
    restDelta: 0.001
  });

  const updateScrollProgress = useCallback((scroll: number) => {
    if (typeof window === "undefined") return;

    const sequenceDistance = window.innerHeight * 0.3;
    const transitionDistance = window.innerHeight * 1.25;
    const gradientDistance = window.innerHeight * 2.25;
    const nextSequenceProgress = Math.max(0, Math.min(1, scroll / sequenceDistance));
    const nextTransitionProgress = Math.max(0, Math.min(1, scroll / transitionDistance));
    const nextGradientProgress = Math.max(0, Math.min(1, scroll / gradientDistance));

    progressValue.set(nextSequenceProgress);
    transitionProgressValue.set(nextTransitionProgress);
    gradientProgressValue.set(nextGradientProgress);

    setShowTransitionStatement(nextTransitionProgress > 0.6);
  }, [progressValue, transitionProgressValue, gradientProgressValue]);

  useLenis((lenisInstance) => {
    updateScrollProgress(lenisInstance.scroll);
  });

  // Fallback native scroll listener for mobile browsers where useLenis might not trigger
  useEffect(() => {
    const handleScrollFallback = () => {
      updateScrollProgress(window.scrollY);
    };

    handleScrollFallback();
    window.addEventListener("scroll", handleScrollFallback, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollFallback);
    };
  }, [updateScrollProgress]);

  const heroOpacity = useTransform(smoothTransitionProgress, [0.28, 0.46], [1, 0]);
  const gradientOpacity = useTransform(smoothTransitionProgress, [0.42, 0.52], [0, 1]);
  const gradientY = useTransform(
    smoothGradientProgress,
    [0.29, 0.58, 0.68, 0.78, 1],
    ["0vh", "-194vh", "-216vh", "-224vh", "-345vh"]
  );
  const statementY = useTransform(smoothTransitionProgress, [0.6, 0.72], [18, 0]);
  const statementExitOpacity = useTransform(smoothGradientProgress, [0.92, 0.98], [1, 0]);
  
  // Parallax translation: starts moving only after approximately 30% of progress
  const backgroundY = useTransform(smoothProgress, [0, 0.3, 1], [0, 0, 40]);

  const lastDrawnFrameRef = useRef<number>(1);

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clamp frameIndex to [1, totalFrames] to prevent out of bounds
    const clampedIndex = Math.max(1, Math.min(totalFrames, frameIndex));

    const img = imagesRef.current[clampedIndex];
    if (img && img.complete) {
      drawImageProp(ctx, img);
      lastDrawnFrameRef.current = clampedIndex;
    } else {
      // Fallback to the last successfully drawn frame (O(1) fallback)
      const fallbackIndex = lastDrawnFrameRef.current;
      const fallbackImg = imagesRef.current[fallbackIndex];
      if (fallbackImg && fallbackImg.complete) {
        drawImageProp(ctx, fallbackImg);
      }
    }
  };

  // Progressive background image loader with concurrency limit
  useEffect(() => {
    let active = true;
    const urls = Array.from({ length: totalFrames }, (_, i) => ({
      index: i + 1,
      url: getFrameUrl(i + 1)
    }));

    // Setup first frame immediately
    const img1 = new Image();
    img1.src = urls[0].url;
    img1.onload = () => {
      if (!active) return;
      imagesRef.current[1] = img1;
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) drawImageProp(ctx, img1);
      }
      
      // Load the rest with limited concurrency (6 concurrent requests)
      const remaining = urls.slice(1);
      let index = 0;
      
      const loadNext = () => {
        if (!active || index >= remaining.length) return;
        const item = remaining[index++];
        
        const img = new Image();
        img.src = item.url;
        img.onload = () => {
          if (!active) return;
          imagesRef.current[item.index] = img;
          
          // Re-draw if we are currently at this frame (using the smoothed progress)
          const clampedSmooth = Math.max(0, Math.min(1, smoothProgress.get()));
          const currentProgressFrame = Math.round(clampedSmooth * (totalFrames - 1)) + 1;
          if (currentProgressFrame === item.index) {
            drawFrame(item.index);
          }
          
          loadNext();
        };
        img.onerror = () => {
          if (!active) return;
          loadNext();
        };
      };
      
      for (let i = 0; i < Math.min(6, remaining.length); i++) {
        loadNext();
      }
    };

    return () => {
      active = false;
    };
  }, [smoothProgress]);

  // Handle canvas sizing and scroll synchronization
  useEffect(() => {
    let rAFId: number | null = null;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const clampedSmooth = Math.max(0, Math.min(1, smoothProgress.get()));
      const currentProgressFrame = Math.round(clampedSmooth * (totalFrames - 1)) + 1;
      drawFrame(currentProgressFrame);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // initial size

    let isDrawing = false;
    let nextFrameIndex = -1;

    const unsubscribe = smoothProgress.on("change", (latest) => {
      const clampedLatest = Math.max(0, Math.min(1, latest));
      const frameIndex = Math.round(clampedLatest * (totalFrames - 1)) + 1;
      nextFrameIndex = frameIndex;
      
      if (!isDrawing) {
        isDrawing = true;
        rAFId = requestAnimationFrame(() => {
          if (nextFrameIndex !== -1) {
            drawFrame(nextFrameIndex);
            nextFrameIndex = -1;
          }
          isDrawing = false;
        });
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      unsubscribe();
      if (rAFId !== null) {
        cancelAnimationFrame(rAFId);
      }
    };
  }, [smoothProgress]);

  useGSAP(
    () => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .fromTo(
          ".hero-kicker",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 1 }
        )
        .fromTo(
          ".hero-title-line",
          { yPercent: 100 },
          { yPercent: 0, duration: 1.2, stagger: 0.1 },
          "-=0.7"
        )
        // NOTE: hero body text (formerly `.hero-copy`) is intentionally NOT
        // animated here — it must stay opacity:1 from first paint for LCP.
        // Only the CTA row keeps the fade-in.
        .fromTo(
          ".hero-cta-group",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
          "-=0.9"
        );
    },
    { scope: containerRef }
  );

  return (
    /* STICKY SCROLL-SCRUB HERO: outer div = scroll track; inner section = sticky
       viewport panel. Outer must NOT have overflow:hidden. */
    <div className="relative w-full" style={{ height: "325vh" }}>
      <section ref={containerRef} className="sticky top-0 h-screen bg-black w-full overflow-hidden">
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[480vh]"
          style={{
            opacity: gradientOpacity,
            y: gradientY,
            background:
              "linear-gradient(180deg, #000000 0%, #000000 18%, #001015 28%, #002B36 39%, #28725F 48%, #75DAB4 56%, #A9EFD6 64%, #D5FFEF 72%, #EEF8F3 80%, #F6F5F4 88%, #F6F5F4 100%)",
          }}
          aria-hidden="true"
        />
        <motion.div className="absolute inset-0 z-10" style={{ opacity: heroOpacity }}>
        <div className="relative h-full w-full overflow-hidden flex items-start pt-[85px] lg:pt-[105px] xl:pt-[115px] 2xl:pt-[125px] px-6 sm:px-8 md:px-10 lg:px-12">
        {/* Canvas Background */}
        <div className="hero-visual-bg pointer-events-none absolute inset-0 z-0 h-full w-full">
          <motion.canvas
            ref={canvasRef}
            style={{ y: backgroundY, scale: 1.05 }}
            className="h-full w-full object-cover origin-center"
          />
          {/* Opaque gradient fade-out at the bottom to blend the 3D model's wrist */}
          <div className="absolute bottom-0 left-0 w-full h-[22%] bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
        </div>

        <motion.div 
          className="relative z-20 mx-auto w-full"
        >
          <div className="flex flex-col items-start lg:max-w-[590px] xl:max-w-[650px] 2xl:max-w-[720px]">
            <GeometricSymbol />
            
            <div className="hero-kicker mb-1.5 text-[11px] font-normal tracking-widest text-white/60 normal-case lg:uppercase md:text-xs">
              {dict.kicker}
            </div>

            <div className="flex flex-col gap-2 md:gap-2.5">
              {/* Above-the-fold hero text is rendered eager (opacity:1, no blur)
                  so it is LCP-eligible at first paint. Only the Y transform
                  animates in — this fixes the ~10s mobile LCP. */}
              <Reveal direction="up" delay={0.1} eager>
                <h1 className="text-[26px] xs:text-[30px] sm:text-[40px] md:text-[48px] lg:text-[54px] xl:text-[60px] 2xl:text-[64px] font-normal leading-[1.15] md:leading-[1.1] tracking-[-0.04em] text-white">
                  {dict.title_1}
                  <br className="block lg:hidden" />{" "}
                  {dict.title_2}
                </h1>
              </Reveal>
              <Reveal direction="up" delay={0.3} eager>
                <p className="mt-1 md:mt-1.5 max-w-md text-[13px] sm:text-sm font-normal leading-relaxed text-neutral-400 md:text-base">
                  {dict.description}
                </p>
              </Reveal>
              {dict.summary && (
                <Reveal direction="up" delay={0.4} eager>
                  {/* Bite-sized RAG summary (40-60 words): a dense, entity-rich
                      intent statement placed right under the H1 for AI Overview
                      extraction. Kept visually quiet to respect the flat hero.
                      This <p> is the mobile LCP element — must paint eagerly. */}
                  <p className="mt-1 max-w-lg text-[12px] sm:text-[13px] font-normal leading-relaxed text-neutral-500">
                    {dict.summary}
                  </p>
                </Reveal>
              )}
            </div>

            <div className="hero-cta-group mt-4 md:mt-6 flex flex-row items-center gap-x-6 lg:gap-x-10">
              <Link 
                href={settings.ctaHref}
                className="group flex items-center gap-3 text-[13px] font-normal text-[#75DAB4] transition-colors hover:text-white md:text-sm"
              >
                <span className="text-lg">→</span>
                {dict.cta}
              </Link>

              <ul className="flex items-center gap-6" aria-label="Social links">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="text-white/20 transition-colors hover:text-white"
                    >
                      {social.icon}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
        </div>
        </motion.div>

        {showTransitionStatement && (
          <motion.div
            className="absolute inset-0 z-20 flex items-start pointer-events-auto pt-[28vh] sm:pt-[29vh] lg:pt-[30vh]"
            style={{ y: statementY, opacity: statementExitOpacity }}
          >
            <div className="site-container">
              <AnimatedTitle
                as="h2"
                text="We create strategies, AI automation systems, digital products, brands and experiences for the world's most ambitious thinkers."
                splitBy="word"
                delay={0.02}
                stagger={0.028}
                viewportMargin="-24% 0px -24% 0px"
                className="max-w-[1040px] select-text font-serif text-[clamp(2.15rem,4vw,3.65rem)] font-normal leading-[1.02] tracking-normal text-white"
              />
              <motion.div
                initial={{ opacity: 0, y: 28, filter: "blur(14px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
                className="mt-7 pointer-events-auto"
              >
                <Link
                  href="/en/about"
                  className="inline-flex h-10 items-center rounded-full border border-white/12 bg-white/[0.14] px-[22px] text-[13px] font-normal leading-none text-white/92 backdrop-blur-md transition-colors duration-300 hover:border-white/22 hover:bg-white/[0.2] hover:text-white"
                >
                  About us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
