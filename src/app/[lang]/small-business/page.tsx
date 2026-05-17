import { SubpageHero } from "@/components/sections/subpage-hero";
import { FlatGrid } from "@/components/ui/flat-grid";

const smbValues = [
  {
    title: "Rapid Deployment",
    description: "Go from concept to execution in days. We focus on building what matters most to your business growth."
  },
  {
    title: "Affordable Automation",
    description: "Enterprise-grade automation tools and workflows scaled down to fit small business budgets and operational needs."
  },
  {
    title: "Direct Access",
    description: "Work directly with our senior designers and engineers without the layers of project management bureaucracy."
  },
  {
    title: "Managed Infrastructure",
    description: "We handle all the technical details, from hosting to security, so you can focus on running your business."
  },
  {
    title: "Scalable Growth",
    description: "Our systems grow with you. Start small and add more features, capacity, and support as your business scales."
  },
  {
    title: "Local Partnership",
    description: "Swiss reliability and proximity. We act as your on-demand technical department, always just a call away."
  }
];

export default function SmallBusinessPage() {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="MAWT for Small Business"
        title="Accelerate your growth with professional technical execution."
      />
      <FlatGrid items={smbValues} />
    </div>
  );
}
