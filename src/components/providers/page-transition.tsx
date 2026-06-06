"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The whole page lives inside this wrapper. Two hard rules learned the hard way:
  //
  // 1. NO `transform` (translate/y). A transform here establishes a containing
  //    block and BREAKS `position: sticky` for every descendant (Vision section).
  //
  // 2. Do NOT hide content on the FIRST (SSR) render. `initial={{opacity:0}}`
  //    ships the entire page at opacity:0, so nothing is "contentful" until
  //    ~270KB of JS downloads + hydrates + the fade runs — that pushed mobile
  //    LCP to ~4s. So the initial load renders fully visible (fast LCP); the
  //    opacity fade only plays on subsequent CLIENT-SIDE route changes.
  const hasMounted = useRef(false);
  useEffect(() => {
    hasMounted.current = true;
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={hasMounted.current ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}
