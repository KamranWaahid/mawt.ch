import { SubpageHero } from "@/components/sections/subpage-hero";
import { PricingGrid } from "@/components/ui/pricing-grid";
import { getPricingPlans } from "@/lib/sanity.queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent and predictable pricing for technical execution and embedded teams.",
};

export default async function PricingPage() {
  const pricingPlans = await getPricingPlans();

  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="Simple Plans"
        title="Predictable pricing for every stage."
      />
      {pricingPlans.length > 0 ? (
        <PricingGrid plans={pricingPlans} />
      ) : (
        <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
          <p className="text-neutral-500 font-normal italic">Pricing plans are being updated. Please check back soon.</p>
        </section>
      )}
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto text-center">
          <h2 className="text-2xl font-normal tracking-tight text-black mb-6">Need a custom solution?</h2>
          <p className="text-neutral-500 font-normal mb-10 max-w-2xl mx-auto">
            We understand that every business is unique. Our team of engineers and designers can build a custom package that fits your specific operational requirements.
          </p>
          <button className="px-8 py-3 bg-black text-white text-sm font-normal hover:bg-neutral-800 transition-colors">
            Contact Sales
          </button>
        </div>
      </section>
    </div>
  );
}
