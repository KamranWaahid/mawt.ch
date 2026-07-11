"use client";

import gsap from "gsap";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";
import { motion, useTransform, useMotionValue, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { Reveal } from "@/components/ui/reveal";
import type { SiteSettings } from "@/lib/types";

gsap.registerPlugin(useGSAP);

type CinematicHeroSectionProps = {
  settings: SiteSettings;
  dict: any;
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

export function CinematicHeroSection({ settings, dict }: CinematicHeroSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lenisRef = useRef<any>(null);
  
  const [heroState, setHeroState] = useState<'hero' | 'logoZoom' | 'videoPlaying' | 'videoComplete' | 'gradient'>('hero');
  const [showTransitionStatement, setShowTransitionStatement] = useState(false);
  
  const progressValue = useMotionValue(0);
  const smoothProgress = useSpring(progressValue, { stiffness: 120, damping: 28, mass: 0.25, restDelta: 0.001 });

  useLenis((lenisInstance) => {
    lenisRef.current = lenisInstance;
    if (heroState === 'videoPlaying') return;
    updateScrollProgress(lenisInstance.scroll);
  });

  useEffect(() => {
    const handleScrollFallback = () => {
      if (heroState === 'videoPlaying') return;
      updateScrollProgress(window.scrollY);
    };
    window.addEventListener("scroll", handleScrollFallback, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollFallback);
  }, [heroState]);

  const updateScrollProgress = useCallback((scroll: number) => {
    if (typeof window === "undefined" || heroState === 'videoPlaying') return;
    
    // Total scroll distance is 400vh
    const maxScroll = window.innerHeight * 4;
    const p = Math.max(0, Math.min(1, scroll / maxScroll));
    progressValue.set(p);

    if (p >= 0.45 && heroState !== 'videoComplete' && heroState !== 'gradient') {
      setHeroState('videoPlaying');
    } else if (p > 0.5 && heroState === 'videoComplete') {
      setHeroState('gradient');
    }
    
    setShowTransitionStatement(p > 0.65);
  }, [progressValue, heroState]);

  useEffect(() => {
    if (heroState === 'videoPlaying') {
      if (lenisRef.current) lenisRef.current.stop();
      document.body.style.overflow = 'hidden';
      
      if (videoRef.current) {
        if (videoRef.current.currentTime === 0 || videoRef.current.ended) {
          videoRef.current.currentTime = 0;
        }
        videoRef.current.play().catch(e => console.error("Autoplay failed:", e));
      }
    } else if (heroState === 'videoComplete' || heroState === 'gradient') {
      if (lenisRef.current) lenisRef.current.start();
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [heroState]);

  const handleVideoEnded = () => {
    setHeroState('videoComplete');
  };

  const handlePlayFallback = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error(e));
    }
  };

  // 1. Text fades out (without moving upward)
  const textY = useTransform(smoothProgress, [0, 1], [0, 0]);
  const textOpacity = useTransform(smoothProgress, [0.05, 0.15], [1, 0]);
  const textBlur = useTransform(smoothProgress, [0.1, 0.15], ["blur(0px)", "blur(8px)"]);
  
  // 2. Logo Zoom
  const logoScale = useTransform(smoothProgress, [0.15, 0.45], [1, 60]);
  const logoOpacity = useTransform(smoothProgress, [0.4, 0.45], [1, 0]);

  // 3. Video Fade in and Out
  const videoOpacityFadeIn = useTransform(smoothProgress, [0.4, 0.45], [0, 1]);
  const videoOpacityFadeOut = useTransform(smoothProgress, [0.6, 0.75], [1, 0]);
  
  const finalVideoOpacity = useTransform(() => {
    if (heroState === 'hero' || heroState === 'logoZoom') {
      return videoOpacityFadeIn.get();
    }
    if (heroState === 'videoPlaying') return 1;
    return videoOpacityFadeOut.get();
  });

  // 4. Gradient Transition
  const gradientOpacity = useTransform(smoothProgress, [0.6, 0.75], [0, 1]);
  const gradientY = useTransform(
    smoothProgress,
    [0.7, 1],
    ["0vh", "-240vh"]
  );
  const statementY = useTransform(smoothProgress, [0.75, 0.85], [18, 0]);
  const statementExitOpacity = useTransform(smoothProgress, [0.95, 1], [1, 0]);

  useGSAP(
    () => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .fromTo(".hero-kicker", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 })
        .fromTo(".hero-title-line", { yPercent: 100 }, { yPercent: 0, duration: 1.2, stagger: 0.1 }, "-=0.7")
        .fromTo(".hero-cta-group", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, "-=0.9");
    },
    { scope: containerRef }
  );

  return (
    <div className="relative w-full" style={{ height: "400vh" }}>
      <section ref={containerRef} className="sticky top-0 h-[100dvh] bg-black w-full overflow-hidden">
        
        {/* Gradient Background (Phase 4) */}
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

        {/* Video Player (Phase 3) */}
        <motion.div 
          className="absolute inset-0 z-10 bg-black flex items-center justify-center"
          style={{ opacity: finalVideoOpacity }}
        >
          <video
            ref={videoRef}
            src="/MotionMAWT.mp4"
            className="w-full h-full object-cover"
            playsInline
            muted
            onEnded={handleVideoEnded}
            preload="auto"
          />
          {heroState === 'videoPlaying' && (
             <div className="absolute inset-0 z-20 hidden items-center justify-center bg-black/40 text-white cursor-pointer group hover:bg-black/20 transition-all" onClick={handlePlayFallback}>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity px-6 py-3 border border-white/20 rounded-full backdrop-blur-sm">Play Film</span>
             </div>
          )}
        </motion.div>

        {/* Logo Zoom (Phase 2) */}
        <motion.div 
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          style={{ scale: logoScale, opacity: logoOpacity, transformOrigin: 'center center' }}
        >
           {/* We center the logo, but adjust origin so we zoom into a black gap. */}
           <img src="/mawt-logo-white.svg" alt="MAWT Logo" className="w-[80vw] max-w-[800px] object-contain" />
        </motion.div>

        {/* Hero Content (Phase 1) */}
        <motion.div 
          className="absolute inset-0 z-30 pointer-events-auto"
          style={{ y: textY, opacity: textOpacity, filter: textBlur }}
        >
          <div className="relative h-full w-full flex items-start pt-[85px] lg:pt-[105px] xl:pt-[115px] 2xl:pt-[125px] px-6 sm:px-8 md:px-10 lg:px-12">
            <div className="relative z-20 mx-auto w-full">
              <div className="flex flex-col items-start lg:max-w-[590px] xl:max-w-[650px] 2xl:max-w-[720px]">
                <GeometricSymbol />
                
                <div className="hero-kicker mb-1.5 text-[11px] font-normal tracking-widest text-white/60 normal-case lg:uppercase md:text-xs">
                  {dict.kicker}
                </div>

                <div className="flex flex-col gap-2 md:gap-2.5">
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
            </div>
          </div>
        </motion.div>

        {/* Transition Statement (Phase 4) */}
        {showTransitionStatement && (
          <motion.div
            className="absolute inset-0 z-40 flex items-start pointer-events-auto pt-[28vh] sm:pt-[29vh] lg:pt-[30vh]"
            style={{ y: statementY, opacity: statementExitOpacity }}
          >
            <div className="site-container w-full px-6 sm:px-8 md:px-10 lg:px-12 mx-auto">
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
