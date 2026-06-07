"use client";

import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  },
};

const ProcessIcon = ({ id }: { id: string }) => {
  const icons: Record<string, React.ReactNode> = {
    "01": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        <circle cx="12" cy="12" r="5" />
      </svg>
    ),
    "02": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M7 11c.667-2 2.333-3 5-3s4.333 1 5 3m-10 2c.667 2 2.333 3 5 3s4.333-1 5-3" />
        <rect x="3" y="5" width="18" height="14" rx="2" />
      </svg>
    ),
    "03": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    "04": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal text-black">
      {icons[id] || icons["01"]}
    </div>
  );
};

export function ProcessSection({ dict }: { dict: any }) {
  return (
    <section className="bg-bg-light py-[120px]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        <SectionReveal>
          {/* Header Badge */}
          <div className="mb-12">
            <Badge label={dict.badge} theme="light" />
          </div>

          {/* Horizontal Divider */}
          <div className="mb-16 h-px w-full bg-black/10" />

          {/* Headline */}
          <div className="mb-16">
            <h2 className="text-3xl font-normal tracking-tight text-black sm:text-4xl md:text-[44px] lg:leading-[1.1]">
              {dict.headline}
            </h2>
          </div>

          {/* Process Grid */}
          <motion.div 
            className="grid gap-px bg-black/5 sm:grid-cols-2 lg:grid-cols-4 border border-black/5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {dict.items.map((item: any) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="group relative flex flex-col bg-white p-10 transition-all duration-300 hover:z-10"
              >
                <div className="mb-12">
                  <ProcessIcon id={item.id} />
                </div>
                
                <div className="mt-auto space-y-3">
                  <h3 className="text-xl font-normal tracking-tight text-black">
                    {item.title}
                  </h3>
                  <p className="text-base font-normal leading-relaxed text-black/60">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}
