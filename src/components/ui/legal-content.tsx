"use client";

import { motion } from "motion/react";

interface LegalSection {
  title: string;
  content: string[];
}

interface LegalContentProps {
  sections: LegalSection[];
}

export function LegalContent({ sections }: LegalContentProps) {
  return (
    <section className="bg-white px-6 py-16 sm:px-8 md:px-10 lg:px-12 md:py-24 lg:py-32">
      <div className="max-w-[800px] mx-auto">
        <div className="flex flex-col gap-16">
          {sections.map((section, index) => (
            <motion.div
              key={section.title || `section-${index}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col gap-6"
            >
              {section.title && (
                <h2 className="text-xl-fluid font-medium tracking-tight text-black">{section.title}</h2>
              )}
              <div className="flex flex-col gap-4">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-base-fluid leading-relaxed text-neutral-500 font-normal max-w-[65ch]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
