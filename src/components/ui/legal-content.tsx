"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import type { LegalBlock, LegalSection } from "@/lib/legal-sections";

interface LegalContentProps {
  sections: LegalSection[];
}

/** Renders `**bold**` spans inline; everything else passes through as text. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, index) =>
        // Odd indices are the captured groups, i.e. the emphasised runs.
        index % 2 === 1 ? (
          <strong key={index} className="font-medium text-neutral-800">
            {part}
          </strong>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

const paragraphClass =
  "text-base-fluid leading-relaxed text-neutral-500 font-normal max-w-[65ch]";

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return (
      <p className={paragraphClass}>
        <RichText text={block} />
      </p>
    );
  }

  if (block.type === "subtitle") {
    return (
      <h3 className="text-base-fluid font-medium tracking-tight text-black mt-2">
        {block.text}
      </h3>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="flex flex-col gap-2 pl-5 max-w-[65ch]">
        {block.items.map((item, index) => (
          <li
            key={index}
            className="text-base-fluid leading-relaxed text-neutral-500 font-normal list-disc marker:text-neutral-300"
          >
            <RichText text={item} />
          </li>
        ))}
      </ul>
    );
  }

  // "lines": a tight block such as a postal address or contact details.
  return (
    <div className="flex flex-col gap-1 max-w-[65ch]">
      {block.items.map((item, index) => (
        <p key={index} className="text-base-fluid leading-relaxed text-neutral-500 font-normal">
          <RichText text={item} />
        </p>
      ))}
    </div>
  );
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
                {section.content.map((block, bIndex) => (
                  <Block key={bIndex} block={block} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
