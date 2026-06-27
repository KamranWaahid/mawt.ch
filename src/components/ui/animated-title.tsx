"use client";

import { motion, useAnimation, useInView, useReducedMotion, type UseInViewOptions } from "motion/react";
import { useEffect, useRef } from "react";
import { usePageTransition } from "@/components/providers/page-transition";

interface AnimatedTitleProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  splitBy?: "line" | "word" | "none";
  once?: boolean;
  viewportMargin?: string;
  style?: React.CSSProperties;
  eager?: boolean;
}

const motionComponents = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  span: motion.span,
  div: motion.div,
  p: motion.p,
} as const;

export function AnimatedTitle({
  text,
  as = "h1",
  className,
  delay = 0.08,
  stagger = 0.045,
  splitBy = "word",
  once = true,
  viewportMargin = "-10% 0px -10% 0px",
  style,
  eager = false,
}: AnimatedTitleProps) {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { isPageTransitionComplete } = usePageTransition();
  const controls = useAnimation();

  const isInView = useInView(containerRef, {
    once: once,
    margin: viewportMargin as UseInViewOptions["margin"],
  });

  const shouldTrigger = isInView && isPageTransitionComplete;

  useEffect(() => {
    if (shouldTrigger) {
      controls.start("visible");
    } else if (!once && !isInView) {
      controls.start("hidden");
    }
  }, [shouldTrigger, isInView, once, controls]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  };

  const childVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0, filter: "none" }
      : {
          opacity: eager ? 1 : 0,
          y: 28,
          filter: eager ? "none" : "blur(14px)",
        },
    visible: {
      opacity: 1,
      y: 0,
      filter: "none",
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1] as const,
          },
    },
  };

  const getWords = (line: string) => {
    const rawWords = line.split(" ");
    const processedWords: string[] = [];
    for (let i = 0; i < rawWords.length; i++) {
      const word = rawWords[i];
      if ((word === "?" || word === "!" || word === ":" || word === ";") && processedWords.length > 0) {
        const lastIndex = processedWords.length - 1;
        processedWords[lastIndex] = processedWords[lastIndex] + "\u00A0" + word;
      } else {
        processedWords.push(word);
      }
    }
    return processedWords;
  };

  const renderContent = () => {
    if (splitBy === "line") {
      return text.split("\n").map((line, i) => (
        <span key={i} className="block">
          <motion.span
            variants={childVariants}
            className="inline-block will-change-[transform,opacity,filter]"
          >
            {line}
          </motion.span>
        </span>
      ));
    }

    if (splitBy === "word") {
      return text.split("\n").map((line, lineIdx) => (
        <span key={lineIdx} className="block">
          {getWords(line).map((word, wordIdx, words) => (
            <span key={`${word}-${wordIdx}`} className="inline">
              <motion.span
                variants={childVariants}
                className="inline-block will-change-[transform,opacity,filter]"
              >
                {word}
              </motion.span>
              {wordIdx < words.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ));
    }

    return (
      <motion.span
        variants={childVariants}
        className="inline-block will-change-[transform,opacity,filter]"
      >
        {text}
      </motion.span>
    );
  };

  const Tag = motionComponents[as] || motion.h1;

  return (
    <Tag
      ref={containerRef as unknown as React.Ref<never>}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
      style={style}
    >
      {renderContent()}
    </Tag>
  );
}
