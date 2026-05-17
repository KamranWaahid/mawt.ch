import { SubpageHero } from "@/components/sections/subpage-hero";
import { FlatGrid } from "@/components/ui/flat-grid";

const communityItems = [
  {
    title: "Developer Forums",
    description: "Join the discussion on our technical forums to share knowledge, ask questions, and collaborate on open-source projects."
  },
  {
    title: "Global Events",
    description: "Connect with our team and fellow technical leaders at our workshops, webinars, and regional meetups."
  },
  {
    title: "Partner Network",
    description: "Collaborate with other agencies and technical specialists within the MAWT ecosystem to deliver complex solutions."
  }
];

export default function CommunityPage() {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="Community"
        title="Connect with the people building the future of execution."
      />
      <FlatGrid items={communityItems} columns={3} />
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-normal tracking-tight text-black">A ecosystem of experts.</h2>
            <p className="text-lg text-neutral-500 font-normal leading-relaxed">
              Our community is built on the shared belief that technical execution is the ultimate differentiator. We bring together developers, designers, and strategists who are passionate about building systems that move the needle.
            </p>
          </div>
          <div className="aspect-[16/9] bg-neutral-100 border border-black/5 flex items-center justify-center">
            <span className="text-neutral-400 font-normal">Community Visual</span>
          </div>
        </div>
      </section>
    </div>
  );
}
