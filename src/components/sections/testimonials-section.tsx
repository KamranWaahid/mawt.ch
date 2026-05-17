import { SectionReveal } from "@/components/ui/section-reveal";
import type { Testimonial } from "@/lib/types";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="px-6 py-20 md:px-12">
      <SectionReveal>
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Client Testimonials
        </h2>
      </SectionReveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <SectionReveal key={testimonial._id}>
            <blockquote className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-lg leading-relaxed text-white">&quot;{testimonial.quote}&quot;</p>
              <footer className="mt-6 text-sm text-neutral-300">
                <span className="font-medium text-white">{testimonial.name}</span>
                {testimonial.role ? <span> - {testimonial.role}</span> : null}
              </footer>
            </blockquote>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
