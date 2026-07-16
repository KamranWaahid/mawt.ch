"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Curtain page transition (DHNN-style): a near-black sheet slides up from the
 * bottom, the route changes while the viewport is covered, then the sheet
 * keeps travelling upward and reveals the new page — one continuous wipe.
 *
 * Deliberately NOT wired to every navigation: links opt in through
 * useCurtainTransition().navigateWithCurtain(href). The regular
 * PageTransition fade still runs underneath (invisible behind the curtain)
 * and reduced-motion users get a plain router.push.
 */

type Phase = "idle" | "covering" | "waiting" | "revealing";

const CurtainContext = createContext<{
  navigateWithCurtain: (href: string) => void;
}>({ navigateWithCurtain: () => {} });

export const useCurtainTransition = () => useContext(CurtainContext);

export function CurtainTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const targetRef = useRef<string | null>(null);

  const navigateWithCurtain = useCallback(
    (href: string) => {
      const targetPath = href.replace(/[?#].*$/, "");
      if (shouldReduceMotion || targetPath === pathname) {
        router.push(href);
        return;
      }
      // A transition already in flight: fall back to a plain push.
      if (targetRef.current) {
        router.push(href);
        return;
      }
      targetRef.current = href;
      router.prefetch?.(href);
      setPhase("covering");
    },
    [shouldReduceMotion, pathname, router],
  );

  // Reveal once the new route is actually rendered under the curtain (plus a
  // beat for paint). Safety net: never stay covered longer than 4s.
  useEffect(() => {
    if (phase !== "waiting" || !targetRef.current) return;
    const targetPath = targetRef.current.replace(/[?#].*$/, "");
    if (pathname === targetPath) {
      const t = setTimeout(() => setPhase("revealing"), 250);
      return () => clearTimeout(t);
    }
    const failsafe = setTimeout(() => setPhase("revealing"), 4000);
    return () => clearTimeout(failsafe);
  }, [phase, pathname]);

  return (
    <CurtainContext.Provider value={{ navigateWithCurtain }}>
      {children}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            key="curtain"
            initial={{ y: "100%" }}
            animate={{ y: phase === "revealing" ? "-100%" : "0%" }}
            transition={{
              duration: phase === "revealing" ? 0.65 : 0.55,
              ease: [0.76, 0, 0.24, 1],
            }}
            onAnimationComplete={() => {
              if (phase === "covering" && targetRef.current) {
                router.push(targetRef.current);
                setPhase("waiting");
              } else if (phase === "revealing") {
                setPhase("idle");
                targetRef.current = null;
              }
            }}
            className="fixed inset-0 z-[200] bg-[#0A0A0A]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </CurtainContext.Provider>
  );
}
