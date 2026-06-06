"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type LenisProviderProps = {
  children: React.ReactNode;
};

// Reset scroll to the top on every route change. Lenis (root mode) keeps its own
// scroll position across client navigations, so landing on a shorter page from
// the bottom of a long one left the viewport pinned at the bottom (e.g. arriving
// on a project page at its closing CTA). Force the top on each pathname change.
function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}

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
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        lerp: 0.1,
      }}
    >
      <ScrollToTopOnNavigate />
      {children}
    </ReactLenis>
  );
}
