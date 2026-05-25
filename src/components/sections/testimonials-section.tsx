"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { Testimonial } from "@/lib/types";

type TestimonialsSectionProps = {
  testimonials?: Testimonial[];
};

const slideImages = [
  "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=600&auto=format&fit=crop", // clouds/sky
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop", // columns/modern interior
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop"  // architecture
];

const defaultTestimonials: Testimonial[] = [
  {
    _id: "t1",
    quote: "What stood out with this is it Studio was simple: clarity beats aesthetics, proof beats features, speed beats planning.",
    name: "Zayd Syed Ali",
    role: "Valley"
  },
  {
    _id: "t2",
    quote: "The team delivered a striking site that elevated our brand overnight and improved qualified leads by 42%.",
    name: "Leena Farooq",
    role: "Marketing Director, Atelier Noire"
  },
  {
    _id: "t3",
    quote: "Every detail felt intentional. The final result is luxurious, fast, and incredibly easy to manage.",
    name: "Daniyal Rehman",
    role: "Founder, Monolith Interiors"
  }
];

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const list = (testimonials && testimonials.length > 0) ? testimonials : defaultTestimonials;
  const displayItems = list.slice(0, 3);
  const activeItem = displayItems[activeIndex % displayItems.length];

  return (
    <section className="relative overflow-hidden bg-bg-light py-12 md:py-20 h-screen max-h-[100vh] flex items-center justify-center border-t border-black/5">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20 flex items-center justify-center h-full">
        {/* Testimonial Card */}
        <div className="relative w-full max-w-[420px] aspect-[3/4] md:max-w-[460px] md:aspect-[3/4] bg-neutral-900 rounded-none overflow-hidden flex flex-col justify-between p-8 md:p-10 text-white shadow-lg">
          
          {/* Animated Background */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Image
                  src={slideImages[activeIndex % slideImages.length]}
                  alt="Testimonial background"
                  fill
                  className="object-cover filter brightness-[0.7] md:brightness-[0.75]"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card Content */}
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            {/* Quote and Author */}
            <div className="max-w-[34ch] pt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col gap-6"
                >
                  <p className="text-lg sm:text-xl md:text-[22px] font-normal leading-[1.25] text-white tracking-tight">
                    &quot;{activeItem.quote}&quot;
                  </p>
                  <div className="text-[13px] sm:text-sm font-normal text-white/90">
                    <span className="font-semibold block">{activeItem.name}</span>
                    {activeItem.role && <span className="opacity-75">{activeItem.role}</span>}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail Navigation Indicators (Bottom Right inside the Card) */}
            <div className="absolute bottom-0 right-0 flex flex-col gap-2.5">
              {displayItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative w-12 h-12 md:w-14 md:h-14 rounded-none overflow-hidden border-2 transition-all duration-300 outline-none ${
                    activeIndex === i 
                      ? "border-white scale-105 shadow-md z-20" 
                      : "border-white/20 hover:border-white/50 hover:scale-102 opacity-70 hover:opacity-100 z-10"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <Image
                    src={slideImages[i % slideImages.length]}
                    alt={`Slide ${i + 1} thumbnail`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
