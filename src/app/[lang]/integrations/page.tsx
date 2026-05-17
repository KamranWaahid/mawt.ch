import { SubpageHero } from "@/components/sections/subpage-hero";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  return {
    title: "Integrations | MAWT Solutions",
    description: "Connected systems that work together. CRM systems, payment gateways, e-commerce platforms, AI tools, and more.",
  };
}

const integrations = [
  { name: "CRM Systems", category: "Operations", description: "Sync customer data and sales workflows across platforms like Salesforce and HubSpot." },
  { name: "Payment Gateways", category: "Finance", description: "Integrate payment processing and billing automation via Stripe and custom banking APIs." },
  { name: "E-Commerce Platforms", category: "Retail", description: "Connect product management, order flows, and inventory systems seamlessly." },
  { name: "AI Tools", category: "Intelligence", description: "Deploy artificial intelligence within your existing workflows for automated analysis and content." },
  { name: "Analytics Platforms", category: "Data", description: "Aggregate business intelligence and user activity into centralized, real-time reporting." },
  { name: "Internal Dashboards", category: "Management", description: "Custom back-office applications connecting disparate data sources into one view." },
  { name: "Marketing Systems", category: "Growth", description: "Automate lead generation, email workflows, and multi-channel campaign tracking." },
  { name: "Third-Party APIs", category: "Infrastructure", description: "Custom microservices connecting proprietary tools and specialized SaaS platforms." }
];

export default async function IntegrationsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="Integrations"
        title="Connected systems that work together to create smoother operations."
      />
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {integrations.map((integration) => (
            <div key={integration.name} className="p-8 border border-black/5 flex flex-col gap-6 rounded-xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 bg-white rounded-xl border border-black/5 flex items-center justify-center group-hover:border-brand-teal/30 transition-colors">
                  <span className="text-[12px] font-bold text-brand-teal">{integration.name.substring(0, 3).toUpperCase()}</span>
                </div>
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">{integration.category}</span>
              </div>
              <h3 className="text-xl font-normal text-black group-hover:text-brand-teal transition-colors">{integration.name}</h3>
              <p className="text-[14px] leading-relaxed text-neutral-500 font-normal">
                {integration.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto max-w-3xl text-center flex flex-col gap-6">
          <h2 className="text-3xl font-normal tracking-tight text-black">Built for Scalability</h2>
          <p className="text-lg leading-relaxed text-neutral-500 font-normal">
            Our integrations are designed to reduce manual work, improve data flow, and support long-term scalability across your entire business ecosystem.
          </p>
        </div>
      </section>
    </div>
  );
}
