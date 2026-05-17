"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { SectionReveal } from "@/components/ui/section-reveal";

export function VisionSection({ dict }: { dict: any }) {
  return (
    <section className="relative overflow-hidden bg-bg-light py-[240px] min-h-[80vh] flex items-center">
      {/* Faded Planet Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <div className="relative h-[120%] w-[120%] -translate-y-[10%]">
          <Image
            src="/PlanetBackground.png"
            alt="Vision atmospheric background"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20 relative z-10">
        <SectionReveal>
          {/* Header Badge */}
          <div className="mb-12 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
            <div className="rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1.5 backdrop-blur-sm">
              <span className="text-[10px] font-normal tracking-[0.2em] text-black/80">{dict.badge}</span>
            </div>
          </div>

          {/* Horizontal Divider */}
          <div className="mb-16 h-px w-full bg-black/10" />

          {/* Main Statement */}
          <div className="max-w-5xl">
            <h2 className="text-3xl font-normal tracking-tight text-black sm:text-4xl md:text-[44px] lg:leading-[1.1]">
              {dict.statement}
            </h2>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
