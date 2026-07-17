"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import Image from "next/image";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { sectionTitleDarkClass } from "@/components/ui/section-title-style";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  },
};

export function ApproachSection({ dict }: { dict: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(true);

  // Measure the scrollable range of the cards container
  useEffect(() => {
    const calculateScrollRange = () => {
      if (cardsRef.current && containerRef.current) {
        const range = cardsRef.current.scrollWidth - containerRef.current.clientWidth;
        setScrollRange(Math.max(0, range));
      }
    };

    calculateScrollRange();
    
    const resizeObserver = new ResizeObserver(() => calculateScrollRange());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (cardsRef.current) resizeObserver.observe(cardsRef.current);

    return () => resizeObserver.disconnect();
  }, [dict?.items]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowLeftBlur(latest > 0.01);
    setShowRightBlur(latest < 0.99);
  });

  if (!dict) return null;

  return (
    <section ref={sectionRef} className="relative h-[250vh] bg-transparent">
      {/* Sticky viewport container */}
      <div className="homepage-process-sticky sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="site-container-xwide w-full" ref={containerRef}>

          {/* Horizontal Divider */}
          <div className="mb-6 h-px w-full bg-white/10 sm:mb-10" />

          {/* Headline */}
          <div className="mb-6 sm:mb-10 md:mb-14">
            <AnimatedTitle
              as="h2"
              text={dict.headline}
              className={sectionTitleDarkClass}
              splitBy="word"
            />
          </div>

          {/* Wrapper to align overlay edges perfectly with viewport boundaries */}
          <div className="relative overflow-hidden">
            {/* Left blur overlay */}
            <div
              className={`absolute left-0 top-0 bottom-6 z-10 pointer-events-none bg-gradient-to-r from-[#161616] via-[#161616]/60 to-transparent backdrop-blur-[3px] w-8 sm:w-16 md:w-28 lg:w-36 transition-opacity duration-300 ${
                showLeftBlur ? "opacity-100" : "opacity-0"
              }`}
              style={{
                maskImage: "linear-gradient(to right, black 25%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, black 25%, transparent)",
              }}
            />

            {/* Right blur overlay */}
            <div
              className={`absolute right-0 top-0 bottom-6 z-10 pointer-events-none bg-gradient-to-l from-[#161616] via-[#161616]/60 to-transparent backdrop-blur-[3px] w-8 sm:w-16 md:w-28 lg:w-36 transition-opacity duration-300 ${
                showRightBlur ? "opacity-100" : "opacity-0"
              }`}
              style={{
                maskImage: "linear-gradient(to left, black 25%, transparent)",
                WebkitMaskImage: "linear-gradient(to left, black 25%, transparent)",
              }}
            />

            {/* Approach Horizontal Swipeable / Draggable Container */}
            <div className="pb-6 select-none overflow-hidden">
              <motion.div 
                ref={cardsRef}
                style={{ x }}
                className="flex gap-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {dict.items?.map((item: any) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="homepage-process-card group relative flex min-h-[460px] w-[min(calc(100vw-2.5rem),22rem)] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-5 pb-0 pt-8 transition-colors duration-500 ease-out hover:bg-white/[0.06] xs:px-8 sm:min-h-[500px] sm:w-[375px] md:min-h-[520px] md:w-[410px] md:px-10 md:pb-0 md:pt-12"
                  >
                    {/* Upper Text */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-lg font-semibold leading-tight tracking-[-0.02em] text-white sm:text-xl md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="text-sm font-normal leading-[1.6] tracking-[-0.015em] text-white/50">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Bottom Centered Image sits flush on bottom edge */}
                    {item.image && (
                      <div className="homepage-process-card-image relative mt-6 flex h-[220px] w-full items-end justify-center pointer-events-none sm:h-[250px] md:h-[280px]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(min-width: 768px) 410px, (min-width: 640px) 375px, calc(100vw - 3rem)"
                          className="object-contain object-bottom select-none"
                          draggable="false"
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
