import { SubpageHero } from "@/components/sections/subpage-hero";
import { FlatGrid } from "@/components/ui/flat-grid";

const personalValues = [
  {
    title: "Personal Branding",
    description: "High-performance digital presence designed to elevate your personal brand and reach your target audience."
  },
  {
    title: "Custom Workflows",
    description: "Personalized automation tools to help you manage your digital life, from content creation to scheduling."
  },
  {
    title: "Secure & Private",
    description: "Enterprise-level security for your personal projects and data, with full control over your digital footprint."
  }
];

export default function PersonalPage() {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="MAWT for Personal"
        title="Professional digital execution for individuals and creators."
      />
      <FlatGrid items={personalValues} columns={3} />
    </div>
  );
}
