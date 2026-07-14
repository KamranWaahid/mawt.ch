"use client";

import { motion } from "motion/react";
import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";

type ApproachStep = {
  id: string;
  title: string;
  body: string;
};

type ApproachStickyStepsProps = {
  steps: ApproachStep[];
};

type LockState = "idle" | "animating" | "ready" | "readyToRelease";

function AnimatedWords({
  text,
  className,
  delay = 0,
  isReversing = false,
  textColor,
}: {
  text: string;
  className?: string;
  delay?: number;
  isReversing?: boolean;
  textColor: string;
}) {
  const words = text.split(" ").filter(Boolean);

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline">
          <motion.span
            className="inline-block will-change-[transform,opacity,filter]"
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", color: textColor }}
            transition={{
              duration: isReversing ? 0.25 : 0.65,
              delay: isReversing ? index * 0.008 : delay + index * 0.025,
              ease: [0.16, 1, 0.3, 1],
              color: { duration: 0.4 }
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

function getStepAnimationDuration(step: ApproachStep, isReversing: boolean) {
  const wordsT = step.title.split(" ").filter(Boolean).length;
  const wordsB = step.body.split(" ").filter(Boolean).length;

  if (isReversing) {
    const maxWords = Math.max(wordsT, wordsB);
    return Math.min(500, (maxWords * 0.008 + 0.25) * 1000);
  } else {
    const durationT = 0.02 + wordsT * 0.025 + 0.65;
    const durationB = 0.16 + wordsB * 0.025 + 0.65;
    return Math.min(1200, Math.max(durationT, durationB) * 1000);
  }
}

// Map the active state index to custom offset values in vh units
function getGradientOffset(index: number): string {
  switch (index) {
    case 0: return "-100vh"; // Step 1 (Understand)
    case 1: return "-180vh"; // Step 2 (Frame)
    case 2: return "-260vh"; // Step 3 (Design)
    case 3: return "-340vh"; // Step 4 (Build)
    case 4: return "-520vh"; // Step 5 (Launch)
    case 5: return "-740vh"; // Exit Final (fully solid white)
    default: return "-100vh";
  }
}

export function ApproachStickySteps({ steps }: ApproachStickyStepsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [navigationDirection, setNavigationDirection] = useState<1 | -1>(1);
  
  // State machine values
  const [lockState, setLockState] = useState<LockState>("idle");

  // Refs for tracking state synchronously in persistent handlers
  const activeIndexRef = useRef(0);
  const lockStateRef = useRef<LockState>("idle");
  const isLockedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const totalStepsRef = useRef(0);

  // Queue scroll intents for requestAnimationFrame processor
  const pendingDirectionRef = useRef<1 | -1 | null>(null);

  const [isCompletedDown, setIsCompletedDown] = useState(false);
  const [isCompletedUp, setIsCompletedUp] = useState(true);
  const isCompletedDownRef = useRef(false);
  const isCompletedUpRef = useRef(true);

  // Refs for gesture momentum and safety locks
  const hasReleasedScrollRef = useRef(true);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const safeSteps = steps.filter((step) => step.title && step.body);
  const totalSteps = safeSteps.length;
  
  useEffect(() => {
    totalStepsRef.current = totalSteps;
  }, [totalSteps, totalStepsRef]);

  const totalStates = totalSteps + 1; // 5 actual steps + 1 exit state (index 5) (6 states total)
  
  // The current step content to display (safe indices are 0 to 4 in safeSteps)
  const stepIndex = Math.min(activeIndex, totalSteps - 1);
  const currentStep = safeSteps[stepIndex] || safeSteps[0];

  // Initialize completed flags based on scroll position on mount
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.top < 0) {
      isCompletedDownRef.current = true;
      isCompletedUpRef.current = false;
      setIsCompletedDown(true);
      setIsCompletedUp(false);
    } else {
      isCompletedDownRef.current = false;
      isCompletedUpRef.current = true;
      setIsCompletedDown(false);
      setIsCompletedUp(true);
    }
  }, []);

  const updateLockState = (state: LockState) => {
    lockStateRef.current = state;
    isLockedRef.current = state !== "idle";
    setLockState(state);
  };

  // Monitor positions via useLenis when scrolling naturally (idle state)
  useLenis((lenis) => {
    lenisRef.current = lenis;

    if (!containerRef.current) return;
    if (isLockedRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const isScrollingDown = lenis.direction === 1;
    const isScrollingUp = lenis.direction === -1;

    // Reset completed flags when we scroll slightly away from the lock threshold
    if (isScrollingDown && rect.top < -200) {
      if (isCompletedUpRef.current) {
        isCompletedUpRef.current = false;
        setIsCompletedUp(false);
      }
    } else if (isScrollingUp && rect.top > 120) {
      if (isCompletedDownRef.current) {
        isCompletedDownRef.current = false;
        setIsCompletedDown(false);
      }
    }
  });

  const handleAnimationComplete = () => {
    if (lockStateRef.current !== "animating") return;

    const currentTotalStates = totalStepsRef.current + 1;
    const isBoundary = activeIndexRef.current === 0 || activeIndexRef.current === currentTotalStates - 1;
    updateLockState(isBoundary ? "readyToRelease" : "ready");
    
    isAnimatingRef.current = false;
    hasReleasedScrollRef.current = true;

    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  };

  const startLockTimeout = (step: ApproachStep | undefined, isReversing: boolean) => {
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    const targetStep = step || safeSteps[safeSteps.length - 1];
    const duration = getStepAnimationDuration(targetStep, isReversing);
    
    // Add extra duration buffer for the 1.5s visual gradient transition timing
    safetyTimeoutRef.current = setTimeout(() => {
      handleAnimationComplete();
    }, duration + 100);
  };

  const lockSection = (startIndex: number, direction: 1 | -1) => {
    activeIndexRef.current = startIndex;
    isAnimatingRef.current = true;
    updateLockState("animating");
    setActiveIndex(startIndex);
    setNavigationDirection(direction);
    hasReleasedScrollRef.current = true;

    // Snap section to the top of viewport natively
    if (containerRef.current) {
      const targetScroll = window.scrollY + containerRef.current.getBoundingClientRect().top;
      window.scrollTo(0, targetScroll);
    }

    // Stop Lenis immediately
    lenisRef.current?.stop();

    const targetStepIndex = Math.min(startIndex, totalSteps - 1);
    startLockTimeout(safeSteps[targetStepIndex], direction < 0);
  };

  const stepByDirection = (direction: 1 | -1) => {
    if (isAnimatingRef.current) return;

    const nextIndex = activeIndexRef.current + direction;
    const currentTotalStates = totalStepsRef.current + 1;

    if (direction === 1) {
      if (nextIndex < currentTotalStates) {
        setNavigationDirection(1);
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        
        isAnimatingRef.current = true;
        updateLockState("animating");
        const targetStepIndex = Math.min(nextIndex, totalStepsRef.current - 1);
        startLockTimeout(safeSteps[targetStepIndex], false);
      } else {
        // One final scroll to release down the page
        if (lockStateRef.current === "readyToRelease") {
          isLockedRef.current = false;
          isCompletedDownRef.current = true;
          updateLockState("idle");
          setIsCompletedDown(true);
          // Restore Lenis on exit
          lenisRef.current?.start();
        } else {
          updateLockState("readyToRelease");
        }
      }
    } else {
      if (nextIndex >= 0) {
        setNavigationDirection(-1);
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        
        isAnimatingRef.current = true;
        updateLockState("animating");
        const targetStepIndex = Math.min(nextIndex, totalStepsRef.current - 1);
        startLockTimeout(safeSteps[targetStepIndex], true);
      } else {
        // One final scroll to release up the page
        if (lockStateRef.current === "readyToRelease") {
          isLockedRef.current = false;
          isCompletedUpRef.current = true;
          updateLockState("idle");
          setIsCompletedUp(true);
          // Restore Lenis on exit
          lenisRef.current?.start();
        } else {
          updateLockState("readyToRelease");
        }
      }
    }
  };

  // Manage body scroll overflow (CSS overflow is hidden while locked)
  useEffect(() => {
    if (lockState !== "idle") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [lockState]);

  // Continuously running requestAnimationFrame processor loop
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      if (
        pendingDirectionRef.current !== null &&
        !isAnimatingRef.current &&
        lockStateRef.current !== "idle"
      ) {
        const dir = pendingDirectionRef.current;
        pendingDirectionRef.current = null;
        stepByDirection(dir);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Intercept wheel, touch, and keyboard inputs persistently on window
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // 1. If locked: prevent default and delegate to step transition
      if (lockStateRef.current !== "idle") {
        if (event.cancelable) event.preventDefault();

        const absDeltaY = Math.abs(event.deltaY);

        // Reset lock release if delta drops to near-zero (indicating swipe release)
        if (absDeltaY < 3) {
          hasReleasedScrollRef.current = true;
          return;
        }

        if (isAnimatingRef.current) return;

        if (!hasReleasedScrollRef.current) {
          return;
        }

        // Accept gesture only if delta exceeds a physical scroll threshold
        if (absDeltaY < 12) return;

        const direction = event.deltaY > 0 ? 1 : -1;
        hasReleasedScrollRef.current = false;
        pendingDirectionRef.current = direction;
        return;
      }

      // 2. If idle: check locking conditions synchronously
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;

      if (isScrollingDown && !isCompletedDownRef.current && rect.top <= 120) {
        if (event.cancelable) event.preventDefault();
        lockSection(0, 1);
      } else if (isScrollingUp && !isCompletedUpRef.current && rect.top >= -120) {
        if (event.cancelable) event.preventDefault();
        const currentTotalStates = totalStepsRef.current + 1;
        lockSection(currentTotalStates - 1, -1);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? 0;
      const deltaY = touchStartY - currentY;

      // 1. If locked: always prevent default and delegate to step transition
      if (lockStateRef.current !== "idle") {
        if (event.cancelable) event.preventDefault();

        if (Math.abs(deltaY) < 10) return;

        if (!hasReleasedScrollRef.current || isAnimatingRef.current) {
          return;
        }

        if (Math.abs(deltaY) > 30) {
          const direction = deltaY > 0 ? 1 : -1;
          hasReleasedScrollRef.current = false;
          pendingDirectionRef.current = direction;
          touchStartY = currentY;
        }
        return;
      }

      // 2. If idle: check locking conditions synchronously
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isScrollingDown = deltaY > 0;
      const isScrollingUp = deltaY < 0;

      if (Math.abs(deltaY) < 5) return;

      if (isScrollingDown && !isCompletedDownRef.current && rect.top <= 120) {
        if (event.cancelable) event.preventDefault();
        lockSection(0, 1);
      } else if (isScrollingUp && !isCompletedUpRef.current && rect.top >= -120) {
        if (event.cancelable) event.preventDefault();
        const currentTotalStates = totalStepsRef.current + 1;
        lockSection(currentTotalStates - 1, -1);
      }
    };

    const handleTouchEnd = () => {
      hasReleasedScrollRef.current = true;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (lockStateRef.current === "idle") return;

      if (lockStateRef.current === "animating") {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
          if (event.cancelable) event.preventDefault();
        }
        return;
      }

      let direction: 1 | -1 | null = null;
      if (event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey) || event.key === "End") {
        direction = 1;
      } else if (event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey) || event.key === "Home") {
        direction = -1;
      }

      if (direction !== null) {
        if (event.cancelable) event.preventDefault();
        pendingDirectionRef.current = direction;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle Dynamic Header Theme Overrides
  useEffect(() => {
    if (lockState === "idle" || totalSteps <= 1) {
      window.dispatchEvent(new CustomEvent("mawt-header-theme", { detail: { theme: null } }));
      return;
    }

    const theme = (activeIndex <= 1 || activeIndex >= 5) ? "dark" : "light";
    window.dispatchEvent(new CustomEvent("mawt-header-theme", { detail: { theme } }));

    return () => {
      window.dispatchEvent(new CustomEvent("mawt-header-theme", { detail: { theme: null } }));
    };
  }, [lockState, activeIndex, totalSteps]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  if (totalSteps === 0) return null;

  // Only indices 0, 1 and 5 are light backgrounds. All others are dark.
  const isLightBg = activeIndex <= 1 || activeIndex >= 5;
  const textColor = isLightBg ? "#000000" : "#F6F5F4";
  const badgeColor = isLightBg ? "rgba(0,0,0,0.6)" : "rgba(246,245,244,0.6)";
  const bodyColor = isLightBg ? "rgba(0,0,0,0.8)" : "rgba(246,245,244,0.8)";

  // Easing transition specifications (1.5s duration, custom cubic-bezier)
  const animDuration = 1.5;
  const animEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

  return (
    <section
      ref={containerRef}
      className="relative z-10 -mt-[1px] h-[100vh] w-full overflow-hidden bg-[#F6F5F4]"
      aria-label="Approach steps"
    >
      <div ref={panelRef} className="absolute inset-0 h-[100vh] overflow-hidden bg-[#F6F5F4]">
        {/* Plateau Linear Gradient Background */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-2vw] right-[-2vw] top-0 z-0 h-[840vh] w-[104vw]"
          animate={{
            y: getGradientOffset(activeIndex),
          }}
          transition={{
            duration: animDuration,
            ease: animEase,
          }}
          style={{
            background:
              "linear-gradient(180deg, #f6f5f4 0vh, #f6f5f4 120vh, #f0f3f2 160vh, #dce5e3 220vh, #baccca 280vh, #819fa0 340vh, #426a70 400vh, #002b36 460vh, #17645f 520vh, #17645f 620vh, #c8d8d5 680vh, #f6f5f4 740vh, #f6f5f4 840vh)",
          }}
        />

        {/* Dummy animation to drive parent animation complete callback */}
        {lockState === "animating" && (
          <motion.div
            key={`dummy-${activeIndex}`}
            initial={{ scale: 0.999 }}
            animate={{ scale: 1 }}
            transition={{
              duration: navigationDirection < 0 ? 0.35 : 0.85,
              ease: "linear"
            }}
            onAnimationComplete={handleAnimationComplete}
          />
        )}

        {/* Desktop layout */}
        <div className="pointer-events-none absolute inset-0 z-30 hidden lg:flex lg:flex-col lg:justify-center px-5 sm:px-7 md:px-9 lg:px-[2.5vw]">
          <div className="mx-auto w-full max-w-[1760px] pt-[120px] pb-[80px]">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex >= 5 ? 0 : 1 }}
              transition={{ duration: 0.25 }}
              className="max-w-[1040px]"
            >
              <motion.span
                className="text-[13px] font-normal tracking-[0.2em] uppercase mb-6 block"
                animate={{ color: badgeColor }}
                transition={{ duration: 0.4 }}
              >
                {currentStep.id} / {String(totalSteps).padStart(2, "0")}
              </motion.span>
              <h2 className="select-text font-serif text-[clamp(2.1rem,4.05vw,3.7rem)] font-normal leading-[1.01] tracking-normal">
                <AnimatedWords
                  text={currentStep.title}
                  delay={0.02}
                  isReversing={navigationDirection < 0}
                  textColor={textColor}
                />
              </h2>
              <p className="mt-6 max-w-[760px] text-[clamp(1.1rem,1.8vw,1.5rem)] font-normal leading-[1.4] opacity-80">
                <AnimatedWords
                  text={currentStep.body}
                  delay={0.16}
                  isReversing={navigationDirection < 0}
                  textColor={bodyColor}
                />
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-center px-5 sm:px-7 md:px-9 lg:hidden">
          <div className="mx-auto w-full max-w-[48rem] pt-[80px] pb-[80px]">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex >= 5 ? 0 : 1 }}
              transition={{ duration: 0.25 }}
            >
              <motion.span
                className="text-[12px] font-normal tracking-[0.2em] uppercase mb-4 block"
                animate={{ color: badgeColor }}
                transition={{ duration: 0.4 }}
              >
                {currentStep.id} / {String(totalSteps).padStart(2, "0")}
              </motion.span>
              <h2 className="select-text font-serif text-[clamp(1.75rem,6vw,2.75rem)] leading-[1.03] font-normal">
                <AnimatedWords
                  text={currentStep.title}
                  delay={0.02}
                  isReversing={navigationDirection < 0}
                  textColor={textColor}
                />
              </h2>
              <p className="mt-4 max-w-[48rem] text-[clamp(0.95rem,2.2vw,1.25rem)] font-normal leading-[1.4] opacity-80">
                <AnimatedWords
                  text={currentStep.body}
                  delay={0.16}
                  isReversing={navigationDirection < 0}
                  textColor={bodyColor}
                />
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
