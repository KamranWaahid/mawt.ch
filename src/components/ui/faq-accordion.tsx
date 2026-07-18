"use client";

import { motion } from "motion/react";
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
              {/* Real h3 in the SSR HTML (not a span): search and AI engines
                  segment pages by headings — questions-as-headings make each
                  Q&A extractable. Classes carry the style, zero visual change. */}
              <h3 className="text-lg font-normal text-black group-hover:text-neutral-600 transition-colors">
                {item.question}
              </h3>
              <div className="shrink-0 ml-4">
                {openIndex === index ? (
                  <Minus size={20} className="text-black" />
                ) : (
                  <Plus size={20} className="text-black" />
                )}
              </div>
            </button>
            {/* Always mounted (animated open/closed) so the answers exist in
                the server-rendered HTML: AI crawlers and Google's FAQ
                rich-result checks read the raw page, and conditionally
                mounted answers were invisible to them. Same visual behavior. */}
            <motion.div
              initial={false}
              animate={{
                height: openIndex === index ? "auto" : 0,
                opacity: openIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
              aria-hidden={openIndex !== index}
            >
              <div className="px-5 pb-8 sm:px-8">
                <p className="pr-10 text-[16px] leading-relaxed text-neutral-500 font-normal sm:pr-12">
                  {item.answer}
                </p>
              </div>
            </motion.div>
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
