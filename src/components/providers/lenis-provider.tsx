"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { prefersNativeScroll } from "@/lib/scroll-environment";

type LenisProviderProps = {
  children: React.ReactNode;
};

type ScrollMode = "pending" | "native" | "lenis";

/**
 * Lenis wheel smoothing on desktop only.
 * Touch / coarse-pointer devices keep native momentum scrolling — Lenis
 * virtual scroll is the main source of mobile stutter, freezes, and jumps.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname();
  const [mode, setMode] = useState<ScrollMode>("pending");

  useEffect(() => {
    const media = window.matchMedia(
      "(hover: none) and (pointer: coarse), (prefers-reduced-motion: reduce)",
    );

    const sync = () => {
      setMode(prefersNativeScroll() ? "native" : "lenis");
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Sanity Studio nested panels need native scroll.
  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  // Pending + native: never mount Lenis (avoids start/teardown flash on phones).
  if (mode !== "lenis") {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        // APPROVED FEEL — do not retune without explicit user validation.
        // The heavy, Apple-like glide (slow wheel, long drift, soft settle)
        // IS the design. Two departures were both rejected by the user:
        // the reactive pass (1.4 / ×0.8 / 0.09 — "saccadé") and the tested
        // midpoint (1.8 / ×0.6 / 0.05 — "on a perdu le smoothness",
        // 2026-07-20). These values are final.
        duration: 2.2,
        // Soft exponential ease similar to Framer-style scroll smoothing.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch stays native even if a desktop user briefly uses a touchscreen.
        syncTouch: false,
        wheelMultiplier: 0.45,
        touchMultiplier: 0.95,
        // Lower lerp adds a smoother, more composed glide without feeling stuck.
        lerp: 0.035,
        // Route in-page #hash links through Lenis and land clear of the
        // fixed header instead of the native jump underneath it.
        anchors: { offset: -96 },
        // Prevent Lenis from hijacking touch events on elements that need
        // native scrolling (e.g. data-lenis-prevent carousels)
        prevent: (node) => {
          if (node.closest("[data-lenis-allow-vertical-scroll]")) return false;
          if (node.closest("[data-lenis-prevent]")) return true;
          if (node.hasAttribute("data-lenis-prevent")) return true;
          // Prevent scroll capturing in any overflow:auto/scroll children.
          // Cheap geometry check first — getComputedStyle sits on the
          // wheel/touch hot path and most nodes don't overflow.
          if (node.scrollWidth > node.clientWidth) {
            const overflowX = window.getComputedStyle(node).overflowX;
            if (overflowX === "auto" || overflowX === "scroll") return true;
          }
          return false;
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}
