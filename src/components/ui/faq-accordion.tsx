"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  noWrapper?: boolean;
}

export function FAQAccordion({ items, noWrapper = false }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const content = (
    <div className="max-w-[800px] mx-auto">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-black/[0.04] bg-white/42">
        {items.map((item, index) => (
          <div key={index} className="border-b border-black/[0.05] last:border-b-0">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="group flex w-full items-center justify-between px-5 py-6 text-left sm:px-8 sm:py-8"
            >
              <span className="text-lg font-normal text-black group-hover:text-neutral-600 transition-colors">
                {item.question}
              </span>
              <div className="shrink-0 ml-4">
                {openIndex === index ? (
                  <Minus size={20} className="text-black" />
                ) : (
                  <Plus size={20} className="text-black" />
                )}
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-8">
                    <p className="text-[16px] leading-relaxed text-neutral-500 font-normal">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );

  if (noWrapper) {
    return content;
  }

  return (
    <section className="px-6 py-14 sm:px-8 md:px-10 lg:px-12 md:py-20 lg:py-28">
      {content}
    </section>
  );
}
