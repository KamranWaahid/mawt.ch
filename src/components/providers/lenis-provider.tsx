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
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        lerp: 0.1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
