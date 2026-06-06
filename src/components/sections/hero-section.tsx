"use client";

import gsap from "gsap";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import type { ReactNode } from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useTransform, useMotionValue, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { Reveal } from "@/components/ui/reveal";
import type { SiteSettings } from "@/lib/types";

gsap.registerPlugin(useGSAP);

type HeroSectionProps = {
  settings: SiteSettings;
  visual?: ReactNode;
  visualSrc?: string;
  visualAlt?: string;
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
  <svg width="71" height="44" viewBox="0 0 71 44" fill="none" className="hero-kicker mb-6 lg:mb-10 opacity-80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35.2503" cy="21.5827" r="16.8204" stroke="white" strokeWidth="0.891184"/>
    <circle cx="21.5825" cy="21.5825" r="21.1369" stroke="white" strokeWidth="0.891184"/>
    <circle cx="48.9204" cy="21.5825" r="21.1369" stroke="white" strokeWidth="0.891184"/>
    <line y1="21.137" x2="70.5027" y2="21.1371" stroke="white" strokeWidth="0.891184"/>
    <line x1="9.60113" y1="3.94763" x2="60.6796" y2="38.4796" stroke="white" strokeWidth="0.891184"/>
    <line y1="-0.445592" x2="61.656" y2="-0.445592" transform="matrix(-0.828443 0.560074 0.560074 0.828443 60.4336 4.31677)" stroke="white" strokeWidth="0.891184"/>
  </svg>
);

export function HeroSection({ settings, dict, visualAlt }: HeroSectionProps & { dict: any }) {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const progressValue = useMotionValue(0);
  const smoothProgress = useSpring(progressValue, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });
  const lenis = useLenis();

  useLenis((lenisInstance) => {
    const scroll = lenisInstance.scroll;
    if (scroll > 1) {
      if (typeof window !== "undefined") {
        const L = window.innerHeight * 0.5;
        const nextProgress = Math.min(1, 0.3 + (scroll / L) * 0.7);
        progressValue.set(nextProgress);
      }
    } else if (scroll <= 1) {
      if (progressValue.get() > 0.3) {
        progressValue.set(0.3);
      }
      if (progressValue.get() < 0.3) {
        lenisInstance.stop();
      }
    }
  });

  const updateProgress = useCallback((delta: number) => {
    const current = progressValue.get();
    const next = Math.max(0, Math.min(0.3, current + delta));
    progressValue.set(next);
    return next;
  }, [progressValue]);

  const frameCount = 81;
  
  const render = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Map progress to frames (0.0 to 0.7 for animation, then hold)
    const easedProgress = Math.min(1, progress / 0.7);
    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(easedProgress * (frameCount - 1))
    );
    
    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete) return;

    // Clear canvas to solid black before drawing the next frame
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image with 'cover' logic
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > imgAspect) {
      drawHeight = canvas.width / imgAspect;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        // Mobile portrait: scale down the visual sequence to occupy the bottom portion
        // of the screen to prevent overlap with the text content at the top.
        const scale = 0.55;
        drawHeight = canvas.height * scale;
        drawWidth = drawHeight * imgAspect;
        offsetX = canvas.width / 2 - drawWidth * 0.6841;
        offsetY = canvas.height - drawHeight;
      } else {
        drawWidth = canvas.height * imgAspect;
        offsetX = (canvas.width - drawWidth) / 2;
      }
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Apply a black linear gradient to fade out the bottom of the drawn image
    // to smoothly blend the flat cut-off wrist of the 3D model.
    const fadeHeight = drawHeight * 0.22;
    const fadeStart = offsetY + drawHeight - fadeHeight;
    const fadeEnd = offsetY + drawHeight;

    const gradient = ctx.createLinearGradient(0, fadeStart, 0, fadeEnd);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, fadeStart, canvas.width, fadeHeight);
  }, []);

  // Frame loading is split to protect LCP/main-thread on mobile:
  //   1. Load ONLY frame 1 immediately and draw it (first visual).
  //   2. Defer the remaining 80 frames to requestIdleCallback (post-LCP /
  //      post-hydration) so the 81-image fetch never competes with the
  //      critical render. render() already skips not-yet-loaded frames.
  const frameSrc = (i: number) =>
    `/HeroImages/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

  useEffect(() => {
    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;

    const first = new Image();
    first.src = frameSrc(1);
    first.onload = () => render(0); // first frame paints the canvas
    images[0] = first;

    let loadedCount = 1;
    const loadRest = () => {
      for (let i = 2; i <= frameCount; i++) {
        const img = new Image();
        img.src = frameSrc(i);
        img.onload = () => {
          loadedCount++;
          if (loadedCount === frameCount) setIsLoaded(true);
        };
        images[i - 1] = img;
      }
    };

    type RIC = (cb: () => void, opts?: { timeout: number }) => number;
    const ric: RIC =
      (typeof window !== "undefined" && (window as unknown as { requestIdleCallback?: RIC }).requestIdleCallback) ||
      ((cb) => window.setTimeout(cb, 1500) as unknown as number);
    const handle = ric(loadRest, { timeout: 3000 });

    return () => {
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cic) cic(handle);
      else clearTimeout(handle);
    };
  }, [render]);

  // Setup canvas and scroll listener
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(smoothProgress.get());
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const unsubscribe = smoothProgress.on("change", (latest) => {
      requestAnimationFrame(() => render(latest));
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      unsubscribe();
    };
  }, [smoothProgress, render]);

  // Hook into Lenis to stop/start scrolling
  useEffect(() => {
    if (!lenis) return;

    const handleProgressChange = (latest: number) => {
      if (latest < 0.3) {
        if (window.scrollY <= 1) {
          lenis.stop();
        } else {
          lenis.start();
        }
      } else {
        lenis.start();
      }
    };

    // Initialize
    handleProgressChange(progressValue.get());

    const unsubscribe = progressValue.on("change", handleProgressChange);
    return () => {
      unsubscribe();
      lenis.start();
    };
  }, [lenis, progressValue]);

  // Handle native scroll/wheel/touch/keyboard inputs to drive progressValue
  useEffect(() => {
    let touchStart = 0;

    const handleWheel = (e: WheelEvent) => {
      const scrollY = window.scrollY;
      const current = progressValue.get();

      if (scrollY <= 1) {
        if (e.deltaY > 0 && current < 0.3) {
          e.preventDefault();
          updateProgress(e.deltaY * 0.0015);
        } else if (e.deltaY < 0 && current > 0 && current <= 0.3) {
          e.preventDefault();
          progressValue.set(0);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStart = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const scrollY = window.scrollY;
      const current = progressValue.get();

      if (scrollY <= 1 && e.touches.length > 0) {
        const touchCurrent = e.touches[0].clientY;
        const deltaY = touchStart - touchCurrent; // positive is scrolling down (swipe up)

        if (deltaY > 0 && current < 0.3) {
          e.preventDefault();
          updateProgress(deltaY * 0.003);
          touchStart = touchCurrent;
        } else if (deltaY < 0 && current > 0 && current <= 0.3) {
          e.preventDefault();
          progressValue.set(0);
          touchStart = touchCurrent;
        }
      }
    };

    const keysToPrevent = ["ArrowDown", "ArrowUp", " ", "PageDown", "PageUp", "Home", "End"];
    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollY = window.scrollY;
      const current = progressValue.get();

      if (scrollY <= 1 && keysToPrevent.includes(e.key)) {
        if ((e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") && current < 0.3) {
          e.preventDefault();
          const step = e.key === " " || e.key === "PageDown" ? 0.05 : 0.01;
          updateProgress(step);
        } else if ((e.key === "ArrowUp" || e.key === "PageUp") && current > 0 && current <= 0.3) {
          e.preventDefault();
          progressValue.set(0);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [progressValue, updateProgress]);

  const contentOpacity = useTransform(smoothProgress, (value) => {
    if (value <= 0.3) return 1;
    if (value >= 0.6) return 0;
    return 1 - (value - 0.3) / 0.3;
  });
  const contentY = useTransform(smoothProgress, (value) => {
    if (value <= 0.3) return 0;
    if (value >= 0.6) return -30;
    return -30 * ((value - 0.3) / 0.3);
  });

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
    <section ref={containerRef} className="relative h-screen bg-black">
      <div className="relative h-full w-full overflow-hidden flex items-start pt-[100px] lg:pt-[140px] px-6 sm:px-8 md:px-10 lg:px-12">
        {/* Frame Sequence Canvas Background */}
        <div className="hero-visual-bg pointer-events-none absolute inset-0 z-0 h-full w-full">
          <canvas 
            ref={canvasRef}
            className="h-full w-full object-cover"
          />
        </div>

        <motion.div 
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative z-20 mx-auto w-full"
        >
          <div className="flex flex-col items-start lg:max-w-3xl">
            <GeometricSymbol />
            
            <div className="hero-kicker mb-2 text-[11px] font-normal tracking-widest text-white/60 normal-case lg:uppercase md:text-xs">
              {dict.kicker}
            </div>

            <div className="flex flex-col gap-3">
              {/* Above-the-fold hero text is rendered eager (opacity:1, no blur)
                  so it is LCP-eligible at first paint. Only the Y transform
                  animates in — this fixes the ~10s mobile LCP. */}
              <Reveal direction="up" delay={0.1} eager>
                <h1 className="text-[28px] xs:text-[32px] sm:text-[44px] md:text-[56px] lg:text-[68px] font-normal leading-[1.15] md:leading-[1.1] tracking-[-0.04em] text-white">
                  {dict.title_1}
                  <br className="block lg:hidden" />{" "}
                  {dict.title_2}
                </h1>
              </Reveal>
              <Reveal direction="up" delay={0.3} eager>
                <p className="mt-3 md:mt-5 max-w-md text-[13px] sm:text-sm font-normal leading-relaxed text-neutral-400 md:text-base">
                  {dict.description}
                </p>
              </Reveal>
              {dict.summary && (
                <Reveal direction="up" delay={0.4} eager>
                  {/* Bite-sized RAG summary (40-60 words): a dense, entity-rich
                      intent statement placed right under the H1 for AI Overview
                      extraction. Kept visually quiet to respect the flat hero.
                      This <p> is the mobile LCP element — must paint eagerly. */}
                  <p className="mt-3 max-w-lg text-[12px] sm:text-[13px] font-normal leading-relaxed text-neutral-500">
                    {dict.summary}
                  </p>
                </Reveal>
              )}
            </div>

            <div className="hero-cta-group mt-5 md:mt-8 flex flex-row items-center gap-x-6 lg:gap-x-10">
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
    </section>
  );
}
