import { SectionReveal } from "@/components/ui/section-reveal";

export function DescriptionSection({ dict }: { dict: any }) {
  if (!dict?.paragraphs?.length) return null;

  return (
    <section
      aria-label="Company description"
      className="bg-white pt-0 pb-12 md:pb-18 lg:pb-22"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <SectionReveal>
        <div className="site-container">
          <div className="space-y-8 md:pl-[10%] lg:pl-[20%]">
            {dict.paragraphs.map((paragraph: string) => (
              <p 
                key={paragraph} 
                className="text-base-fluid font-normal leading-relaxed text-neutral-800 max-w-3xl"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
