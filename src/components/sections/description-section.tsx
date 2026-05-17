import { SectionReveal } from "@/components/ui/section-reveal";

const descriptionParagraphs = [
  "We design and deploy systems that shape how businesses operate, scale, and deliver. Our focus is not on branding alone, but on building structured, future-ready infrastructures that connect workflows, integrate automation and AI, and support real execution. Every system is tailored to the way your business actually runs, with precision, clarity, and long-term usability in mind.",
  "Since our launch, our mission has been to deliver solutions that go beyond surface-level output. We combine system design, automation, digital product development, and embedded team deployment to create environments where work flows seamlessly and performance improves over time. From integrating AI into existing operations to building connected platforms and workflows, everything we deliver is designed to be used, not just presented.",
  "We partner with startups, growing companies, and established B2B organizations that need more than ideas. They need execution. By replacing manual processes, reducing operational friction, and embedding the right expertise directly into your workflow, we help build systems that scale with your business.",
  "We take pride in delivering outcomes that extend beyond aesthetics, systems that improve efficiency, enable better decisions, and create the foundation for sustainable growth.",
];

export function DescriptionSection({ dict }: { dict: any }) {
  return (
    <section aria-label="Company description" className="bg-bg-light px-6 pb-24 pt-12 sm:px-10 lg:px-20">
      <SectionReveal>
        <div className="mx-auto max-w-[1440px]">
          <div className="space-y-8 md:pl-[10%] lg:pl-[20%]">
            {dict.paragraphs.map((paragraph: string) => (
              <p 
                key={paragraph} 
                className="text-base font-normal leading-relaxed text-neutral-800 md:text-lg md:leading-relaxed max-w-3xl"
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
