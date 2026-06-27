"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { sectionTitleClass } from "@/components/ui/section-title-style";

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

  const handleWheel = (e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

    e.preventDefault();
    el.scrollLeft += e.deltaX;
    updateBlurStates();
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="site-container-wide">

        {/* Horizontal Divider */}
        <div className="mb-10 h-px w-full bg-black/10" />

        {/* Headline */}
        <div className="mb-10 sm:mb-14">
          <AnimatedTitle
            as="h2"
            text={dict.headline}
            className={sectionTitleClass}
            splitBy="word"
          />
        </div>

          {/* Wrapper to align overlay edges perfectly with viewport boundaries */}
          <div className="relative overflow-hidden">
            {/* Left blur overlay */}
            <div
              className={`absolute left-0 top-0 bottom-6 z-10 pointer-events-none bg-gradient-to-r from-[#F4F8F5] via-[#F4F8F5]/60 to-transparent backdrop-blur-[3px] w-8 sm:w-16 md:w-28 lg:w-36 transition-opacity duration-300 ${
                showLeftBlur ? "opacity-100" : "opacity-0"
              }`}
              style={{
                maskImage: "linear-gradient(to right, black 25%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, black 25%, transparent)",
              }}
            />

            {/* Right blur overlay */}
            <div
              className={`absolute right-0 top-0 bottom-6 z-10 pointer-events-none bg-gradient-to-l from-[#F4F8F5] via-[#F4F8F5]/60 to-transparent backdrop-blur-[3px] w-8 sm:w-16 md:w-28 lg:w-36 transition-opacity duration-300 ${
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
              data-lenis-allow-vertical-scroll
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onWheel={handleWheel}
              onScroll={updateBlurStates}
              style={{
                scrollSnapType: isDragging ? "none" : "x mandatory",
                cursor: isDragging ? "grabbing" : "grab",
              }}
              className="overflow-x-auto no-scrollbar pb-6 select-none"
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
                    className="group relative flex flex-col justify-between bg-[#EDEDED]/50 hover:bg-[#E3EAE6]/70 border border-black/[0.02] rounded-2xl pt-8 px-5 xs:px-8 pb-0 md:pt-12 md:px-10 md:pb-0 transition-all duration-500 ease-out w-[calc(100vw-3rem)] sm:w-[375px] md:w-[410px] shrink-0 snap-align-start min-h-[460px] sm:min-h-[500px] md:min-h-[520px] overflow-hidden"
                  >
                    {/* Upper Text */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold tracking-[-0.02em] text-neutral-900 leading-tight sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="text-sm font-normal leading-[1.6] tracking-[-0.015em] text-black/50">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Bottom Centered Image sits flush on bottom edge */}
                    {item.image && (
                      <div className="relative w-full h-[220px] sm:h-[250px] md:h-[280px] mt-6 flex items-end justify-center pointer-events-none">
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
      </div>
    </section>
  );
}
