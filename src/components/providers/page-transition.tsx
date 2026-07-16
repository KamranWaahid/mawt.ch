"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ReactNode, useEffect, useState, useRef, createContext, useContext } from "react";
import { useLenis } from "lenis/react";
import { useCurtainTransition } from "@/components/providers/curtain-transition";

/**
 * PAGE TRANSITION — two modes on top of ONE stable AnimatePresence (always
 * mode="wait": switching AnimatePresence modes mid-flight is unreliable).
 *
 * "fade" (default): gentle fade + 8px drift, exit-before-enter, scroll never
 * locked, Lenis never stopped.
 *
 * "slide" (opt-in via CurtainTransitionProvider — the Services nav links):
 * the provider froze a visual snapshot of the old page at z-[110] at click
 * time. The old page exits with the NORMAL fade, invisibly, under that
 * opaque snapshot. The ENTERING page mounts inside <SlideSheet>, fixed at
 * z-[120], and rises from the bottom over the snapshot — DHNN-style.
 *
 * The rise is a plain CSS transform transition, NOT a Framer animation:
 * transform transitions run on the compositor thread, so the sheet glides
 * smoothly even while the main thread is busy hydrating the heavy page
 * inside it (Framer's JS-driven y dropped every frame during hydration and
 * the rise appeared instant). On landing, scroll resets under the covering
 * sheet, then the provider releases (snapshot removed, wrapper unfixed).
 */

export const PageTransitionContext = createContext<{ isPageTransitionComplete: boolean }>({
  isPageTransitionComplete: true,
});

export const usePageTransition = () => useContext(PageTransitionContext);

// Only animate on client after first render
let isInitialLoad = true;

type Mode = "fade" | "slide";

const pageVariants: Variants = {
  // Slide mode: the wrapper does not animate through Framer at all — the
  // SlideSheet inside owns the motion. Fade keeps the historic behavior.
  hidden: (mode: Mode) => (mode === "slide" ? { opacity: 1 } : { opacity: 0, y: 8 }),
  visible: (mode: Mode) =>
    mode === "slide"
      ? { opacity: 1, transition: { duration: 0 } }
      : {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        },
  // Exit is always the plain fade: in slide mode it plays invisibly under
  // the opaque snapshot, so one exit behavior serves both modes.
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/**
 * Compositor-driven rising sheet. Mounts translated a full viewport down,
 * flips to translate-0 after two rAFs (guaranteeing the browser painted the
 * initial position), and reports landing via transitionend. A local timer
 * backs up transitionend; the provider's own failsafe backs up everything.
 */
function SlideSheet({ children, onLanded }: { children: ReactNode; onLanded: () => void }) {
  const [risen, setRisen] = useState(false);
  const landedRef = useRef(false);

  const land = () => {
    if (landedRef.current) return;
    landedRef.current = true;
    onLanded();
  };

  // The page hydrating INSIDE the sheet can block the main thread for a
  // while (long in dev, brief in prod). If we flip to translate-0 before the
  // browser ever painted the off-screen position, the transition has no
  // visible start and the sheet just appears. So: wait for three consecutive
  // frames under 50ms (paint pipeline flowing again) before starting the
  // rise, with a hard cap so it always starts eventually.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let stable = 0;
    const tick = () => {
      const now = performance.now();
      const delta = now - last;
      last = now;
      stable = delta < 50 ? stable + 1 : 0;
      if (stable >= 3) {
        setRisen(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const cap = setTimeout(() => setRisen(true), 2500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cap);
    };
  }, []);

  // transitionend backup, armed only once the rise actually started.
  useEffect(() => {
    if (!risen) return;
    const backup = setTimeout(land, 1100);
    return () => clearTimeout(backup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [risen]);

  return (
    <div
      onTransitionEnd={(e) => {
        if (e.propertyName === "transform" && e.target === e.currentTarget) land();
      }}
      style={{
        transitionProperty: "transform",
        transitionDuration: "750ms",
        transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
      }}
      className={`fixed inset-0 z-[120] h-screen w-full overflow-hidden bg-[#161616] shadow-[0_-24px_80px_rgba(0,0,0,0.45)] will-change-transform ${
        risen ? "translate-y-0" : "translate-y-[100vh] rounded-t-[28px]"
      }`}
    >
      {children}
    </div>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();
  const { takePendingSlide, isSlideArmed, releaseSlide } = useCurtainTransition();

  // Decide the mode ONCE per pathname change, synchronously during render.
  // Refs only — they mutate reliably even inside a transition render.
  const lastPathRef = useRef(pathname);
  const modeRef = useRef<Mode>("fade");
  if (pathname !== lastPathRef.current) {
    lastPathRef.current = pathname;
    modeRef.current = !shouldReduceMotion && takePendingSlide() ? "slide" : "fade";
  }
  const mode = modeRef.current;
  const sliding = mode === "slide" && isSlideArmed;

  const landSheet = () => {
    // Reset scroll while the viewport is still covered by the sheet, THEN
    // release (remove snapshot + unfix) — the swap is invisible.
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    releaseSlide();
  };

  useEffect(() => {
    isInitialLoad = false;
  }, []);

  if (isInitialLoad) {
    return (
      <PageTransitionContext.Provider value={{ isPageTransitionComplete: true }}>
        <div className="w-full">{children}</div>
      </PageTransitionContext.Provider>
    );
  }

  const variants = shouldReduceMotion ? reducedVariants : pageVariants;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        custom={mode}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        className="w-full"
        onAnimationStart={() => {
          // Fade swaps pages in place: reset scroll up front (historic
          // behavior). Slide keeps the snapshot still and resets scroll at
          // landing instead.
          if (mode === "fade") {
            if (lenis) lenis.scrollTo(0, { immediate: true });
            else if (typeof window !== "undefined") window.scrollTo({ top: 0 });
          }
        }}
      >
        <PageTransitionContext.Provider value={{ isPageTransitionComplete: true }}>
          {sliding ? <SlideSheet onLanded={landSheet}>{children}</SlideSheet> : children}
        </PageTransitionContext.Provider>
      </motion.div>
    </AnimatePresence>
  );
}
