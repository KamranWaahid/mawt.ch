"use client";

import { usePathname } from "next/navigation";
import { 
  AnimatePresence, 
  motion, 
  useMotionValue, 
  useMotionTemplate,
  useIsPresent,
  type Variants, 
  type Transition 
} from "motion/react";
import { ReactNode } from "react";

// Premium, gravity-like Framer-style physics with smooth momentum and soft stickiness.
const transitionPhysics: Transition = {
  type: "spring",
  stiffness: 85,
  damping: 20,
  mass: 0.8,
  restDelta: 0.001,
};

// The new page translates upwards like a full-screen fixed curtain.
// The old page stays exactly where it is and gets visually covered.
const pageVariants: Variants = {
  initial: { 
    y: "100vh", 
    zIndex: 10 
  },
  enter: { 
    y: "0vh", 
    zIndex: 10,
    transition: transitionPhysics
  },
  exit: { 
    y: "0vh", // Stays perfectly still
    zIndex: 0, 
    // We pass the same physics so the exiting component stays alive in the DOM
    // exactly as long as the new page takes to finish its entrance.
    transition: transitionPhysics 
  }
};

// This hidden component rides along with the entering page to calculate the blur intensity.
// It uses `useIsPresent` to guarantee that only the incoming page controls the dock's blur.
function BlurDockDriver({ blurValue }: { blurValue: any }) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      variants={pageVariants}
      className="hidden"
      onUpdate={(latest) => {
        if (!isPresent) return; // Ignore updates from the exiting page

        const y = latest.y;
        let vh = 0;
        
        if (typeof y === "number") {
          vh = (y / window.innerHeight) * 100;
        } else if (typeof y === "string") {
          vh = parseFloat(y);
        }

        // The blur dock activates dynamically to "receive" the incoming page.
        // It fades in as the page approaches the top, stays fully active as the page slides under,
        // and safely fades to 0 just as the page docks.
        if (vh > 40) {
          blurValue.set(0);
        } else if (vh <= 40 && vh > 20) {
          // Fade in (from 0 to 24)
          const progress = (40 - vh) / 20;
          blurValue.set(progress * 24);
        } else if (vh <= 20 && vh > 10) {
          // Full frosted-glass intensity
          blurValue.set(24);
        } else if (vh <= 10 && vh >= 0) {
          // Fade out cleanly so the final resting state is perfectly sharp (0px)
          const progress = vh / 10;
          blurValue.set(progress * 24);
        } else {
          blurValue.set(0);
        }
      }}
    />
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Shared motion value to drive the fixed global top dock
  const blurValue = useMotionValue(0);
  const backdropFilter = useMotionTemplate`blur(${blurValue}px)`;

  return (
    <div className="relative w-full flex-1">
      {/* 
        Fixed Top Blur Dock
        Pinned permanently to the top of the viewport above all page content.
        It remains invisible until the new page slides up underneath it.
      */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[15vh] z-50 pointer-events-none"
        style={{
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          // A gradient mask restricts the blur to the very top edge, fading out downwards
          maskImage: 'linear-gradient(to bottom, black 20%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent)',
        }}
      />

      {/* 
        mode="popLayout" forces the exiting page to become position:absolute.
        Because its `exit` variant sets y: 0, it stays perfectly in place, fully visible,
        while the new page slides completely over it like a curtain.
      */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          // bg-background is critical to ensure the rising curtain is solid and fully occludes the old page
          className="w-full relative bg-background"
        >
          <BlurDockDriver blurValue={blurValue} />
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
