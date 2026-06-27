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
        // Shorter duration = more responsive, less "laggy" feeling.
        // 1.5 felt stuck on trackpads and touch devices; 0.9 is premium but snappy.
        duration: 0.9,
        // Standard ease — feels smooth but not floaty
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Lower touch multiplier prevents over-scrolling on mobile
        touchMultiplier: 1.5,
        // lerp controls momentum: 0.1 is very slow/floaty; 0.12 gives a balanced feel
        lerp: 0.12,
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
