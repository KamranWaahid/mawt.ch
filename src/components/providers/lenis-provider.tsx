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
        // Smooth but connected: the previous tuning (lerp 0.035, wheel ×0.45)
        // made the page visibly drag behind the wheel and feel stuck. These
        // values keep the composed glide while the page answers input
        // immediately and direction changes register without lag.
        duration: 1.4,
        // Soft exponential ease similar to Framer-style scroll smoothing.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch stays native even if a desktop user briefly uses a touchscreen.
        syncTouch: false,
        wheelMultiplier: 0.8,
        touchMultiplier: 1,
        // lerp governs when set: high enough to track input, low enough to glide.
        lerp: 0.09,
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
