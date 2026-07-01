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
        // Deliberately slower than native while staying responsive on trackpads.
        duration: 1.55,
        // Soft exponential ease similar to Framer-style scroll smoothing.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.68,
        // Lower touch multiplier prevents over-scrolling on mobile.
        touchMultiplier: 0.95,
        // Lower lerp adds a smoother, more composed glide without feeling stuck.
        lerp: 0.06,
        // Prevent Lenis from hijacking touch events on elements that need
        // native scrolling (e.g. data-lenis-prevent carousels)
        prevent: (node) => {
          if (node.closest("[data-lenis-allow-vertical-scroll]")) return false;
          if (node.closest("[data-lenis-prevent]")) return true;
          if (node.hasAttribute("data-lenis-prevent")) return true;
          // Prevent scroll capturing in any overflow:auto/scroll children
          const style = window.getComputedStyle(node);
          const overflowX = style.overflowX;
          if ((overflowX === "auto" || overflowX === "scroll") && node.scrollWidth > node.clientWidth) {
            return true;
          }
          return false;
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}
