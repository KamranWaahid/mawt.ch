"use client";

import { motion, useReducedMotion } from "motion/react";
import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import {
  Binary,
  Compass,
  Layers3,
  Rocket,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";

type ApproachStep = {
  id: string;
  title: string;
  body: string;
};

type ApproachStickyStepsProps = {
  steps: ApproachStep[];
  stepsLabel?: string;
};

type LockState = "idle" | "animating" | "ready" | "readyToRelease";

const STEP_ICONS: LucideIcon[] = [ScanSearch, Compass, Layers3, Binary, Rocket];

function AnimatedWords({
  text,
  className,
  delay = 0,
  isReversing = false,
  reduceMotion = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  isReversing?: boolean;
  reduceMotion?: boolean;
}) {
  const words = text.split(" ").filter(Boolean);

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline">
          <motion.span
            className="inline-block will-change-[transform,opacity]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: isReversing ? 0.2 : 0.45,
              delay: isReversing ? index * 0.006 : delay + index * 0.018,
              ease: [0.22, 1, 0.36, 1],
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
  const maxWords = Math.max(wordsT, wordsB);
  if (isReversing) {
    return Math.min(260, (maxWords * 0.006 + 0.12) * 1000);
  }
  const durationT = 0.02 + wordsT * 0.012 + 0.28;
  const durationB = 0.12 + wordsB * 0.012 + 0.28;
  return Math.min(620, Math.max(durationT, durationB) * 1000);
}

/** Map active step index → vertical offset for the dark tonal gradient. */
function getGradientOffset(index: number): string {
  switch (index) {
    case 0:
      return "0vh";
    case 1:
      return "-80vh";
    case 2:
      return "-160vh";
    case 3:
      return "-240vh";
    case 4:
      return "-320vh";
    default:
      return "0vh";
  }
}

const DARK_GRADIENT =
  "linear-gradient(180deg, #161616 0vh, #161616 80vh, #1a1a1a 140vh, #1d1d1d 200vh, #1a2220 260vh, #162422 320vh, #141c1b 380vh, #161616 440vh, #161616 520vh)";

function StepContent({
  step,
  totalSteps,
  stepIndex,
  navigationDirection,
  reduceMotion,
  compact = false,
}: {
  step: ApproachStep;
  totalSteps: number;
  stepIndex: number;
  navigationDirection: 1 | -1;
  reduceMotion: boolean | null;
  compact?: boolean;
}) {
  const Icon = STEP_ICONS[stepIndex] || STEP_ICONS[0];

  return (
    <div className={compact ? "w-full max-w-xl" : "max-w-[920px]"}>
      <div className="mb-7 flex items-center gap-4">
        <DarkPageIcon icon={Icon} />
        <span className="text-[12px] font-normal tracking-wide text-white/40">
          {step.id} / {String(totalSteps).padStart(2, "0")}
        </span>
      </div>

      <h2
        className={
          compact
            ? "select-text text-[clamp(1.8rem,6vw,2.6rem)] font-medium leading-[1.08] tracking-tight text-white"
            : "select-text text-[clamp(2.1rem,4vw,3.6rem)] font-medium leading-[1.05] tracking-tight text-white"
        }
      >
        <AnimatedWords
          text={step.title}
          delay={0.02}
          isReversing={navigationDirection < 0}
          reduceMotion={Boolean(reduceMotion)}
        />
      </h2>

      <p
        className={
          compact
            ? "mt-5 text-[15px] font-normal leading-relaxed text-white/55 sm:text-[16px]"
            : "mt-6 max-w-[54ch] text-[clamp(1rem,1.35vw,1.2rem)] font-normal leading-relaxed text-white/55"
        }
      >
        <AnimatedWords
          text={step.body}
          delay={0.1}
          isReversing={navigationDirection < 0}
          reduceMotion={Boolean(reduceMotion)}
        />
      </p>
    </div>
  );
}

function StepRail({
  steps,
  activeIndex,
  label,
}: {
  steps: ApproachStep[];
  activeIndex: number;
  label?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 z-40 hidden w-[140px] items-center pr-[2.5vw] lg:flex xl:w-[180px]">
      <div className="w-full">
        {label && (
          <p className="mb-5 text-[11px] font-normal tracking-wide text-white/30">
            {label}
          </p>
        )}
        <ol className="space-y-3" aria-hidden="true">
          {steps.map((step, index) => {
            const active = index === activeIndex;
            const passed = index < activeIndex;
            return (
              <li key={step.id} className="flex items-center gap-3">
                <span
                  className={`h-px transition-[transform,opacity,background-color] duration-300 ${
                    active
                      ? "w-8 bg-white opacity-100"
                      : passed
                        ? "w-5 bg-white/35 opacity-100"
                        : "w-3 bg-white/15 opacity-70"
                  }`}
                />
                <span
                  className={`text-[12px] font-normal tabular-nums transition-colors duration-300 ${
                    active ? "text-white" : passed ? "text-white/45" : "text-white/22"
                  }`}
                >
                  {step.id}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function ApproachStickySteps({
  steps,
  stepsLabel,
}: ApproachStickyStepsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const reduceMotion = useReducedMotion();

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [navigationDirection, setNavigationDirection] = useState<1 | -1>(1);
  const [lockState, setLockState] = useState<LockState>("idle");

  const activeIndexRef = useRef(0);
  const lockStateRef = useRef<LockState>("idle");
  const isLockedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const totalStepsRef = useRef(0);
  const pendingDirectionRef = useRef<1 | -1 | null>(null);

  const [, setIsCompletedDown] = useState(false);
  const [, setIsCompletedUp] = useState(true);
  const isCompletedDownRef = useRef(false);
  const isCompletedUpRef = useRef(true);

  const hasReleasedScrollRef = useRef(true);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safeSteps = steps.filter((step) => step.title && step.body);
  const totalSteps = safeSteps.length;

  useEffect(() => {
    totalStepsRef.current = totalSteps;
  }, [totalSteps]);

  const stepIndex = Math.min(activeIndex, Math.max(totalSteps - 1, 0));
  const currentStep = safeSteps[stepIndex] || safeSteps[0];

  useEffect(() => {
    if (!isMounted || isMobile) return;
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
  }, [isMounted, isMobile]);

  const updateLockState = (state: LockState) => {
    lockStateRef.current = state;
    isLockedRef.current = state !== "idle";
    setLockState(state);
  };

  useLenis((lenis) => {
    if (!isMounted) return;

    lenisRef.current = lenis;
    if (!containerRef.current) return;

    if (isMobile) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
      const nextIndex = Math.min(
        Math.floor(progress * totalSteps),
        totalSteps - 1,
      );
      if (nextIndex !== activeIndexRef.current) {
        setNavigationDirection(nextIndex > activeIndexRef.current ? 1 : -1);
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
      return;
    }

    if (isLockedRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const isScrollingDown = lenis.direction === 1;
    const isScrollingUp = lenis.direction === -1;

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

    const currentTotalStates = totalStepsRef.current;
    const isBoundary =
      activeIndexRef.current === 0 ||
      activeIndexRef.current === currentTotalStates - 1;
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
    const duration = reduceMotion
      ? 120
      : getStepAnimationDuration(targetStep, isReversing);

    safetyTimeoutRef.current = setTimeout(() => {
      handleAnimationComplete();
    }, duration + 80);
  };

  const lockSection = (startIndex: number, direction: 1 | -1) => {
    activeIndexRef.current = startIndex;
    isAnimatingRef.current = true;
    updateLockState("animating");
    setActiveIndex(startIndex);
    setNavigationDirection(direction);
    hasReleasedScrollRef.current = true;

    if (containerRef.current) {
      const targetScroll =
        window.scrollY + containerRef.current.getBoundingClientRect().top;
      window.scrollTo(0, targetScroll);
    }

    lenisRef.current?.stop();

    const targetStepIndex = Math.min(startIndex, totalSteps - 1);
    startLockTimeout(safeSteps[targetStepIndex], direction < 0);
  };

  const stepByDirection = (direction: 1 | -1) => {
    if (isAnimatingRef.current) return;

    const nextIndex = activeIndexRef.current + direction;
    const currentTotalStates = totalStepsRef.current;

    if (direction === 1) {
      if (nextIndex < currentTotalStates) {
        setNavigationDirection(1);
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);

        isAnimatingRef.current = true;
        updateLockState("animating");
        const targetStepIndex = Math.min(nextIndex, totalStepsRef.current - 1);
        startLockTimeout(safeSteps[targetStepIndex], false);
      } else if (lockStateRef.current === "readyToRelease") {
        isLockedRef.current = false;
        isCompletedDownRef.current = true;
        updateLockState("idle");
        setIsCompletedDown(true);
        lenisRef.current?.start();
      } else {
        updateLockState("readyToRelease");
      }
    } else if (nextIndex >= 0) {
      setNavigationDirection(-1);
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      isAnimatingRef.current = true;
      updateLockState("animating");
      const targetStepIndex = Math.min(nextIndex, totalStepsRef.current - 1);
      startLockTimeout(safeSteps[targetStepIndex], true);
    } else if (lockStateRef.current === "readyToRelease") {
      isLockedRef.current = false;
      isCompletedUpRef.current = true;
      updateLockState("idle");
      setIsCompletedUp(true);
      lenisRef.current?.start();
    } else {
      updateLockState("readyToRelease");
    }
  };

  useEffect(() => {
    if (!isMounted || isMobile) return;

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
  }, [isMounted, isMobile, lockState]);

  useEffect(() => {
    if (!isMounted || isMobile) return;

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
    // Intentionally stable: stepByDirection closes over refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, isMobile]);

  useEffect(() => {
    if (!isMounted || isMobile) return;

    const handleWheel = (event: WheelEvent) => {
      if (lockStateRef.current !== "idle") {
        if (event.cancelable) event.preventDefault();

        const absDeltaY = Math.abs(event.deltaY);

        if (absDeltaY < 3) {
          hasReleasedScrollRef.current = true;
          return;
        }

        if (isAnimatingRef.current) return;
        if (!hasReleasedScrollRef.current) return;
        if (absDeltaY < 12) return;

        const direction = event.deltaY > 0 ? 1 : -1;
        hasReleasedScrollRef.current = false;
        pendingDirectionRef.current = direction;
        return;
      }

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;

      if (isScrollingDown && !isCompletedDownRef.current && rect.top <= 120) {
        if (event.cancelable) event.preventDefault();
        lockSection(0, 1);
      } else if (isScrollingUp && !isCompletedUpRef.current && rect.top >= -120) {
        if (event.cancelable) event.preventDefault();
        lockSection(totalStepsRef.current - 1, -1);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? 0;
      const deltaY = touchStartY - currentY;

      if (lockStateRef.current !== "idle") {
        if (event.cancelable) event.preventDefault();

        if (Math.abs(deltaY) < 10) return;
        if (!hasReleasedScrollRef.current || isAnimatingRef.current) return;

        if (Math.abs(deltaY) > 30) {
          const direction = deltaY > 0 ? 1 : -1;
          hasReleasedScrollRef.current = false;
          pendingDirectionRef.current = direction;
          touchStartY = currentY;
        }
        return;
      }

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
        lockSection(totalStepsRef.current - 1, -1);
      }
    };

    const handleTouchEnd = () => {
      hasReleasedScrollRef.current = true;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (lockStateRef.current === "idle") return;

      if (lockStateRef.current === "animating") {
        if (
          ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
            event.key,
          )
        ) {
          if (event.cancelable) event.preventDefault();
        }
        return;
      }

      let direction: 1 | -1 | null = null;
      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        (event.key === " " && !event.shiftKey) ||
        event.key === "End"
      ) {
        direction = 1;
      } else if (
        event.key === "ArrowUp" ||
        event.key === "PageUp" ||
        (event.key === " " && event.shiftKey) ||
        event.key === "Home"
      ) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, isMobile]);

  useEffect(() => {
    return () => {
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      lenisRef.current?.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (totalSteps === 0) return null;

  const animDuration = reduceMotion ? 0.01 : 0.55;
  const animEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

  if (!isMounted) {
    return (
      <>
        <section
          ref={containerRef}
          className="relative z-10 hidden h-[100dvh] w-full overflow-hidden bg-[#161616] lg:block"
          aria-label="Approach steps (desktop)"
        >
          <div ref={panelRef} className="absolute inset-0 h-[100dvh] overflow-hidden bg-[#161616]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520vh] w-full"
              style={{ background: DARK_GRADIENT }}
            />
            <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-center">
              <div className="site-container-xwide pt-[120px] pb-[80px]">
                <StepContent
                  step={safeSteps[0]}
                  totalSteps={totalSteps}
                  stepIndex={0}
                  navigationDirection={1}
                  reduceMotion
                />
              </div>
            </div>
            <StepRail steps={safeSteps} activeIndex={0} label={stepsLabel} />
          </div>
        </section>

        <section
          className="relative z-10 block border-t border-white/10 bg-[#161616] py-16 md:py-24 lg:hidden"
          aria-label="Approach steps (mobile)"
        >
          <div className="site-container-xwide">
            {stepsLabel && (
              <p className="mb-10 text-[13px] font-normal text-white/40">{stepsLabel}</p>
            )}
            <div className="flex flex-col gap-12 sm:gap-16">
              {safeSteps.map((step, index) => {
                const Icon = STEP_ICONS[index] || STEP_ICONS[0];
                return (
                  <div
                    key={step.id}
                    className="flex flex-col border-b border-white/10 pb-10 sm:pb-12 last:border-b-0 last:pb-0"
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <DarkPageIcon icon={Icon} />
                      <span className="text-[12px] font-normal tracking-wide text-white/40">
                        {step.id} / {String(totalSteps).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-[clamp(1.6rem,5vw,2.2rem)] font-medium leading-tight tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-[15px] font-normal leading-relaxed text-white/55 sm:text-[16px]">
                      {step.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </>
    );
  }

  if (isMobile) {
    return (
      <section
        ref={containerRef}
        className="relative z-10 block w-full bg-[#161616]"
        style={{ height: `${Math.max(totalSteps * 55, 240)}vh` }}
        aria-label="Approach steps (mobile)"
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#161616] max-[520px]:overflow-y-auto max-[520px]:overscroll-contain">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520vh] w-full"
            animate={{ y: getGradientOffset(activeIndex) }}
            transition={{ duration: animDuration, ease: animEase }}
            style={{ background: DARK_GRADIENT }}
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-40 pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] sm:pt-28">
            <div className="site-container-xwide">
            <div className="flex items-center gap-2">
              {safeSteps.map((step, index) => (
                <span
                  key={step.id}
                  className={`h-px flex-1 transition-colors duration-300 ${
                    index <= activeIndex ? "bg-white/70" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
            {stepsLabel && (
              <p className="mt-4 text-[11px] font-normal tracking-wide text-white/35">
                {stepsLabel}
              </p>
            )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-center max-[520px]:relative max-[520px]:min-h-[100dvh] max-[520px]:justify-start max-[520px]:pt-36 max-[520px]:pb-10">
            <div className="site-container-xwide">
            <div className="mx-auto w-full max-w-xl">
              <motion.div
                key={activeIndex}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
              >
                <StepContent
                  step={currentStep}
                  totalSteps={totalSteps}
                  stepIndex={stepIndex}
                  navigationDirection={navigationDirection}
                  reduceMotion={reduceMotion}
                  compact
                />
              </motion.div>
            </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative z-10 block h-[100dvh] w-full overflow-hidden bg-[#161616]"
      aria-label="Approach steps (desktop)"
    >
      <div ref={panelRef} className="absolute inset-0 h-[100dvh] overflow-hidden bg-[#161616]">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520vh] w-full"
          animate={{ y: getGradientOffset(activeIndex) }}
          transition={{ duration: animDuration, ease: animEase }}
          style={{ background: DARK_GRADIENT }}
        />

        {lockState === "animating" && (
          <motion.div
            key={`dummy-${activeIndex}`}
            initial={{ opacity: 0.999 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: navigationDirection < 0 ? 0.28 : 0.55,
              ease: "linear",
            }}
            onAnimationComplete={handleAnimationComplete}
          />
        )}

        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-center">
          <div className="site-container-xwide pt-[120px] pb-[80px] pr-[160px] xl:pr-[200px]">
            <motion.div
              key={activeIndex}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <StepContent
                step={currentStep}
                totalSteps={totalSteps}
                stepIndex={stepIndex}
                navigationDirection={navigationDirection}
                reduceMotion={reduceMotion}
              />
            </motion.div>
          </div>
        </div>

        <StepRail steps={safeSteps} activeIndex={stepIndex} label={stepsLabel} />
      </div>
    </section>
  );
}
