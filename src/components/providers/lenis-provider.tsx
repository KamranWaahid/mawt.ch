"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";

type LenisProviderProps = {
  children: React.ReactNode;
};

export function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname();

  // Disable smooth scrolling in Sanity Studio as it breaks nested scrolling panels
  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        smoothWheel: true,
        // Keep a composed glide but stay connected to physical input: the
        // previous 0.45 multiplier + 0.035 lerp made scrolling drag ~2s
        // behind the wheel, reading as "stuck".
        wheelMultiplier: 0.75,
        // Lower touch multiplier prevents over-scrolling on mobile.
        touchMultiplier: 0.95,
        // Note: when `lerp` is set, Lenis ignores `duration`/`easing` — lerp
        // is the single source of truth for the smoothing.
        lerp: 0.08,
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
