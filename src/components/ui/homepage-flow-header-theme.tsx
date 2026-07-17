"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * While the dark post-hero homepage flow occupies the upper viewport,
 * force the fixed header into the light theme (white text/logo) used across
 * the dark catalogue pages. Clears the override when the flow leaves so the
 * hero's own light-statement zone can keep black nav text.
 */
export function HomepageFlowHeaderTheme({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setTheme = (theme: "light" | null) => {
      window.dispatchEvent(
        new CustomEvent("mawt-header-theme", { detail: { theme } }),
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setTheme(entry.isIntersecting ? "light" : null);
      },
      {
        // Treat as "in the dark flow" once the band crosses the upper third.
        rootMargin: "-12% 0px -55% 0px",
        threshold: 0,
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      setTheme(null);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
