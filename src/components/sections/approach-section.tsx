"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Badge } from "@/components/ui/badge";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(false);

  const updateBlurStates = () => {
    const el = scrollRef.current;
    if (!el) return;

    // Check if scrolled past the start (left side has content outside of screen)
    const canScrollLeft = el.scrollLeft > 10;
    setShowLeftBlur(canScrollLeft);

    // Check if there's still content to scroll to the right (right side has content outside of screen)
    const maxScroll = el.scrollWidth - el.clientWidth;
    const canScrollRight = el.scrollLeft < maxScroll - 10;
    setShowRightBlur(canScrollRight);
  };

  useEffect(() => {
    updateBlurStates();
    
    // Attach listener to window resize
    window.addEventListener("resize", updateBlurStates);
    return () => {
      window.removeEventListener("resize", updateBlurStates);
    };
  }, [dict?.items]);

  if (!dict) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
    updateBlurStates();
  };

  return (
    <section className="bg-[#F1F8F5] py-24 sm:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        <SectionReveal>
          {/* Header Badge */}
          {dict.badge && (
            <div className="mb-8">
              <Badge label={dict.badge} theme="light" />
            </div>
          )}

          {/* Horizontal Divider */}
          <div className="mb-10 h-px w-full bg-black/10" />

          {/* Headline */}
          <div className="mb-14">
            <h2 className="text-3xl font-medium tracking-[-0.03em] text-black sm:text-4xl md:text-[45px] lg:leading-[1.1] max-w-3xl">
              {dict.headline}
            </h2>
          </div>

          {/* Wrapper to align overlay edges perfectly with viewport boundaries */}
          <div className="relative -mx-6 sm:-mx-10 lg:-mx-20 overflow-hidden">
            {/* Left blur overlay */}
            <div
              className={`absolute left-0 top-0 bottom-6 z-10 pointer-events-none bg-gradient-to-r from-[#F1F8F5] via-[#F1F8F5]/60 to-transparent backdrop-blur-[3px] w-8 sm:w-16 md:w-28 lg:w-36 transition-opacity duration-300 ${
                showLeftBlur ? "opacity-100" : "opacity-0"
              }`}
              style={{
                maskImage: "linear-gradient(to right, black 25%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, black 25%, transparent)",
              }}
            />

            {/* Right blur overlay */}
            <div
              className={`absolute right-0 top-0 bottom-6 z-10 pointer-events-none bg-gradient-to-l from-[#F1F8F5] via-[#F1F8F5]/60 to-transparent backdrop-blur-[3px] w-8 sm:w-16 md:w-28 lg:w-36 transition-opacity duration-300 ${
                showRightBlur ? "opacity-100" : "opacity-0"
              }`}
              style={{
                maskImage: "linear-gradient(to left, black 25%, transparent)",
                WebkitMaskImage: "linear-gradient(to left, black 25%, transparent)",
              }}
            />

            {/* Approach Horizontal Swipeable / Draggable Container */}
            <div 
              ref={scrollRef}
              data-lenis-prevent 
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onScroll={updateBlurStates}
              style={{
                scrollSnapType: isDragging ? "none" : "x mandatory",
                cursor: isDragging ? "grabbing" : "grab",
              }}
              className="px-6 sm:px-10 lg:px-20 overflow-x-auto no-scrollbar pb-6 select-none snap-x snap-mandatory scroll-smooth"
            >
              <motion.div 
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
                    className="group relative flex flex-col justify-between bg-[#EDEDED]/50 hover:bg-[#E3EAE6]/70 border border-black/[0.02] rounded-2xl pt-10 px-8 pb-0 md:pt-12 md:px-10 md:pb-0 transition-all duration-500 ease-out w-[310px] xs:w-[340px] sm:w-[375px] md:w-[410px] shrink-0 snap-align-start min-h-[520px] overflow-hidden"
                  >
                    {/* Upper Text */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-900 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm font-normal leading-[1.6] tracking-[-0.015em] text-black/50">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Bottom Centered Image sits flush on bottom edge */}
                    {item.image && (
                      <div className="relative w-full h-[260px] md:h-[280px] mt-6 flex items-end justify-center pointer-events-none">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-contain object-bottom select-none"
                          draggable="false"
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
