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
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12">
      <div className="max-w-[800px] mx-auto">
        <div className="flex flex-col border-t border-black/5">
          {items.map((item, index) => (
            <div key={index} className="border-b border-black/5">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-8 flex items-center justify-between text-left group"
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
    </section>
  );
}
