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
    <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12">
      <div className="max-w-[800px] mx-auto">
        <div className="flex flex-col gap-16">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-2xl font-normal tracking-tight text-black">{section.title}</h2>
              <div className="flex flex-col gap-4">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-[16px] leading-relaxed text-neutral-500 font-normal">
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
