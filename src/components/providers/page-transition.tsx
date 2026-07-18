"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ReactNode, useEffect, useRef, createContext, useContext } from "react";
import { useLenis } from "lenis/react";
import { useCurtainTransition } from "@/components/providers/curtain-transition";

/**
 * Two page-transition modes on one AnimatePresence.
 *
 * "fade" (fallback — reduced motion, or navigations that bypass the curtain):
 * classic tiny fade+lift. Never touches layout beyond the historic scroll
 * reset. Scroll position never locked, Lenis never stopped.
 *
 * "slide" (default for internal links via CurtainTransitionProvider):
 * the provider froze a snapshot of the old page (z-110) and is rising a
 * lightweight facade sheet (z-120) on the compositor. Here the new page
 * simply mounts in normal flow, invisible under those overlays, resets
 * scroll, and reports readiness — the provider then reveals it by fading
 * the facade. Hydration weight can no longer eat the animation, because the
 * animated element (the facade) contains almost nothing.
 */

export const PageTransitionContext = createContext<{ isPageTransitionComplete: boolean }>({
  isPageTransitionComplete: true,
});

export const usePageTransition = () => useContext(PageTransitionContext);

// Only animate on client after first render
let isInitialLoad = true;

type Mode = "fade" | "slide";

const pageVariants: Variants = {
  // Slide mode: the wrapper does not animate at all — the provider's facade
  // owns the motion. Fade keeps the historic behavior.
  hidden: (mode: Mode) => (mode === "slide" ? { opacity: 1 } : { opacity: 0, y: 8 }),
  visible: (mode: Mode) =>
    mode === "slide"
      ? { opacity: 1, y: 0, transition: { duration: 0 } }
      : {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        },
  // Exit plays under the snapshot during slide (invisible). Keep it short.
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/**
 * Mounts WITH the entering page (inside the AnimatePresence child), so its
 * effect runs exactly when the new page is committed to the DOM — the one
 * reliable "page is here" signal. Resets scroll first (invisible under the
 * provider's overlays), then lets the provider reveal.
 */
function SlideMountSignal() {
  const lenis = useLenis();
  const { notifyPageReady } = useCurtainTransition();
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
    notifyPageReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();
  const { takePendingSlide } = useCurtainTransition();

  // Back/forward navigations must keep the browser's scroll restoration —
  // forcing scrollTo(0) there makes history feel broken. popstate fires
  // before the pathname updates, so a ref flag set here is consumed by the
  // very next pathname-change render below. (The curtain provider aborts its
  // overlays on popstate; this handles the SCROLL side.)
  const traversalRef = useRef(false);
  const skipScrollResetRef = useRef(false);
  useEffect(() => {
    const onPopState = () => {
      traversalRef.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Decide the mode ONCE per pathname change, synchronously during render.
  // Refs only — they mutate reliably even inside a transition render.
  /* eslint-disable react-hooks/refs -- deliberate render-time protocol: the
     mode must be decided during the pathname-change render itself (an effect
     is too late — the enter animation already read it). */
  const lastPathRef = useRef(pathname);
  const modeRef = useRef<Mode>("fade");
  if (pathname !== lastPathRef.current) {
    lastPathRef.current = pathname;
    modeRef.current = !shouldReduceMotion && takePendingSlide() ? "slide" : "fade";
    skipScrollResetRef.current = traversalRef.current;
    traversalRef.current = false;
  }
  const mode = modeRef.current;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    isInitialLoad = false;
  }, []);

  // Failsafe on every route change: no section may leave Lenis stopped for
  // the next page (a leaked stop() reads as a completely frozen site). All
  // sections that stop Lenis do so from user interaction, never on mount,
  // so an unconditional start() here can't undo a legitimate lock.
  useEffect(() => {
    if (lenis?.isStopped) lenis.start();
  }, [pathname, lenis]);

  const variants = shouldReduceMotion ? reducedVariants : pageVariants;

  return (
    <AnimatePresence mode={mode === "slide" ? "sync" : "wait"} initial={false}>
      <motion.div
        key={pathname}
        custom={mode}
        initial={isInitialLoad ? false : "hidden"}
        animate="visible"
        exit="exit"
        variants={variants}
        className="w-full"
        onAnimationStart={(definition) => {
          // Fade swaps pages in place: reset scroll up front (historic
          // behavior). Slide resets via SlideMountSignal instead. History
          // traversal (back/forward) skips the reset entirely so browser
          // scroll restoration stays in charge.
          if (definition === "visible" && mode === "fade" && !skipScrollResetRef.current) {
            if (lenis) lenis.scrollTo(0, { immediate: true });
            else if (typeof window !== "undefined") window.scrollTo({ top: 0 });
          }
        }}
      >
        <PageTransitionContext.Provider value={{ isPageTransitionComplete: true }}>
          {mode === "slide" && <SlideMountSignal />}
          {children}
        </PageTransitionContext.Provider>
      </motion.div>
    </AnimatePresence>
  );
}
