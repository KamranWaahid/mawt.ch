import { SubpageHero } from "@/components/sections/subpage-hero";
import { FlatGrid } from "@/components/ui/flat-grid";

const solutionItems = [
  {
    title: "Connected Ecosystems",
    description: "We build integrated systems that allow data to flow seamlessly between your marketing, sales, and operations tools, eliminating manual data entry."
  },
  {
    title: "Operational Automation",
    description: "Our custom automation engines handle repetitive tasks, from client onboarding to invoice generation, freeing up your team for high-value work."
  },
  {
    title: "Internal Tools",
    description: "We design and develop custom back-office applications, dashboards, and reporting systems tailored specifically to your business processes."
  },
  {
    title: "Customer Platforms",
    description: "High-performance customer interfaces, from e-commerce portals to service dashboards, built for speed and reliability."
  },
  {
    title: "AI Integration",
    description: "We deploy artificial intelligence within your existing workflows to provide predictive analytics, content generation, and automated customer support."
  },
  {
    title: "Legacy Modernization",
    description: "We help you transition from outdated legacy systems to modern, scalable cloud infrastructure without disrupting your daily operations."
  }
];

export default function SolutionsPage() {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="Systems"
        title="We build the infrastructure that keeps your business moving."
      />
      <FlatGrid items={solutionItems} columns={3} />
    </div>
  );
}
