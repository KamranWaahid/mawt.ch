import { SubpageHero } from "@/components/sections/subpage-hero";
import { StatusGrid } from "@/components/ui/status-grid";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  return {
    title: "System Status | MAWT Solutions",
    description: "Real-time monitoring and incident response protocols for MAWT Solutions digital infrastructure.",
  };
}

const statusItems: any[] = [
  { service: "Website Uptime", status: "Operational", uptime: "100.00%" },
  { service: "API Performance", status: "Operational", uptime: "99.99%" },
  { service: "Hosting Infrastructure", status: "Operational", uptime: "99.99%" },
  { service: "Automation Workflows", status: "Operational", uptime: "99.98%" },
  { service: "Third-party Integrations", status: "Operational", uptime: "99.95%" }
];

export default async function StatusPage({ params }: { params: Promise<{ lang: Locale }> }) {
  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="System Status"
        title="We monitor the performance and reliability of our systems continuously."
      />
      <StatusGrid items={statusItems} />
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-normal tracking-tight text-black">Incident Response</h2>
            <p className="text-lg leading-relaxed text-neutral-500 font-normal">
              If a disruption occurs, our team follows a strict operational protocol to restore services with minimal impact.
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex gap-6 items-start">
               <span className="text-sm font-bold text-brand-teal bg-brand-teal/5 px-3 py-1 rounded-full">01</span>
               <div className="flex flex-col gap-1"><h4 className="text-lg font-medium text-black">Identify</h4><p className="text-neutral-500 text-sm">Identify the root cause of the issue quickly through our automated alerting systems.</p></div>
            </div>
            <div className="flex gap-6 items-start">
               <span className="text-sm font-bold text-brand-teal bg-brand-teal/5 px-3 py-1 rounded-full">02</span>
               <div className="flex flex-col gap-1"><h4 className="text-lg font-medium text-black">Isolate</h4><p className="text-neutral-500 text-sm">Isolate the affected systems or microservices to prevent broader platform degradation.</p></div>
            </div>
            <div className="flex gap-6 items-start">
               <span className="text-sm font-bold text-brand-teal bg-brand-teal/5 px-3 py-1 rounded-full">03</span>
               <div className="flex flex-col gap-1"><h4 className="text-lg font-medium text-black">Restore</h4><p className="text-neutral-500 text-sm">Deploy patches, reroute traffic, or restore functionality from secure backup clusters.</p></div>
            </div>
            <div className="flex gap-6 items-start">
               <span className="text-sm font-bold text-brand-teal bg-brand-teal/5 px-3 py-1 rounded-full">04</span>
               <div className="flex flex-col gap-1"><h4 className="text-lg font-medium text-black">Communicate</h4><p className="text-neutral-500 text-sm">Communicate transparently with affected clients and provide detailed post-mortem reports.</p></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
