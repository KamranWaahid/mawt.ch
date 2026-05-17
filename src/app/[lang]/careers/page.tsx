import { SubpageHero } from "@/components/sections/subpage-hero";
import { FlatGrid } from "@/components/ui/flat-grid";
import { getCareers } from "@/lib/sanity.queries";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  return {
    title: "Careers | MAWT Solutions",
    description: "Build meaningful digital work with our team of designers, developers, strategists, and thinkers.",
  };
}

const cultureItems = [
  {
    title: "Autonomy",
    description: "We operate with a modern and flexible mindset. Every team member has the autonomy to solve problems independently and take ownership of their work."
  },
  {
    title: "Collaboration",
    description: "We build multidisciplinary teams where designers, developers, and strategists work closely together to create seamless digital ecosystems."
  },
  {
    title: "Continuous Learning",
    description: "Technology moves fast. We prioritize continuous learning and provide the environment needed to explore new tools, AI workflows, and modern architectures."
  },
  {
    title: "High Standards",
    description: "We care deeply about quality, innovation, and detail. We value the quality of ideas and execution over unnecessary hierarchy."
  }
];

export default async function CareersPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const openPositions = await getCareers();

  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="Careers"
        title="Build meaningful digital work with a team that values quality and detail."
      />
      <FlatGrid items={cultureItems} columns={2} />
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl font-normal tracking-tight text-black mb-4">Open Opportunities</h2>
            <p className="text-lg text-neutral-500 font-normal leading-relaxed">
              We regularly collaborate with specialists across multiple disciplines. Even if there is no open role listed, we are always interested in connecting with talented people.
            </p>
          </div>
          
          <div className="flex flex-col gap-8">
            {openPositions.length > 0 ? (
              openPositions.map((job) => (
                <div key={job._id} className="flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-black/5 group">
                  <div>
                    <h3 className="text-xl font-normal text-black group-hover:text-brand-teal transition-colors">{job.title}</h3>
                    <p className="text-neutral-500 font-normal mt-1">{job.location} / {job.type}</p>
                  </div>
                  <button className="mt-4 md:mt-0 px-6 py-2.5 bg-black text-white hover:bg-brand-teal transition-colors text-sm font-medium rounded-full">
                    Apply Now
                  </button>
                </div>
              ))
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-black/5">
                {["UI/UX Designers", "Web Developers", "Automation Specialists", "Brand Designers", "Creative Strategists", "Content Creators", "Motion Designers", "AI & Integration Specialists"].map((role, i) => (
                  <div key={i} className="p-6 bg-neutral-50 rounded-xl border border-black/5 flex flex-col justify-between gap-4 group hover:border-black/20 transition-all duration-300">
                     <span className="text-sm font-bold text-brand-teal bg-brand-teal/5 px-2.5 py-1 rounded-full w-fit">0{i+1}</span>
                     <h4 className="text-lg font-medium text-black group-hover:text-brand-teal transition-colors">{role}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
