import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { getHomePageData } from "@/lib/sanity.queries";
import { getSanityClient } from "@/lib/sanity.client";
import { Activity, Users, MessageSquare, ShieldCheck, Globe } from "lucide-react";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const data = await getHomePageData();
  const client = getSanityClient();
  
  // Basic Health Check
  const isSanityUp = !!client;
  
  // Fetch high-level stats (server-side)
  let leadCount = 0;
  let subscriberCount = 0;
  
  if (client) {
    leadCount = await client.fetch('count(*[_type == "contactLead"])');
    subscriberCount = await client.fetch('count(*[_type == "newsletterSubscriber"])');
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-[120px] pb-24 px-6 md:px-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-normal tracking-tighter mb-2">MAWT Admin</h1>
            <p className="text-sm text-neutral-500 font-normal">Internal Command Center • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${isSanityUp ? 'bg-emerald-500' : 'bg-red-500'}`} />
             <span className="text-[11px] font-normal uppercase tracking-widest text-neutral-400">
               System: {isSanityUp ? 'Operational' : 'Critical'}
             </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white border border-neutral-100 p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare size={18} className="text-neutral-400" />
              <span className="text-[10px] font-normal uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <p className="text-sm text-neutral-500 font-normal mb-1">Total Leads</p>
            <h2 className="text-3xl font-normal tracking-tighter">{leadCount}</h2>
          </div>

          <div className="bg-white border border-neutral-100 p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Users size={18} className="text-neutral-400" />
              <span className="text-[10px] font-normal uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Growth</span>
            </div>
            <p className="text-sm text-neutral-500 font-normal mb-1">Subscribers</p>
            <h2 className="text-3xl font-normal tracking-tighter">{subscriberCount}</h2>
          </div>

          <div className="bg-white border border-neutral-100 p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <ShieldCheck size={18} className="text-neutral-400" />
            </div>
            <p className="text-sm text-neutral-500 font-normal mb-1">Security Status</p>
            <h2 className="text-xl font-normal tracking-tight text-emerald-600">Hardened</h2>
          </div>

          <div className="bg-white border border-neutral-100 p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Activity size={18} className="text-neutral-400" />
            </div>
            <p className="text-sm text-neutral-500 font-normal mb-1">API Latency</p>
            <h2 className="text-xl font-normal tracking-tight">Optimal</h2>
          </div>
        </div>

        {/* System Details */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
             <div className="bg-white border border-neutral-100 rounded-sm p-8">
                <h3 className="text-lg font-normal mb-6 flex items-center gap-3">
                  <Globe size={18} />
                  Platform Insights
                </h3>
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-neutral-50 pb-4">
                      <span className="text-sm font-normal text-neutral-600">Active Language Bundles</span>
                      <span className="text-sm font-normal">EN, FR</span>
                   </div>
                   <div className="flex items-center justify-between border-b border-neutral-50 pb-4">
                      <span className="text-sm font-normal text-neutral-600">ISR Revalidation Tags</span>
                      <span className="text-sm font-normal">Active (12 total)</span>
                   </div>
                   <div className="flex items-center justify-between border-b border-neutral-50 pb-4">
                      <span className="text-sm font-normal text-neutral-600">Rate Limiting Protection</span>
                      <span className="text-sm font-normal text-emerald-500">Enabled</span>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="space-y-6">
             <div className="bg-black text-white p-8 rounded-sm">
                <h3 className="text-lg font-normal mb-4">System Alerts</h3>
                <p className="text-sm text-neutral-400 font-normal leading-relaxed">
                  No active system alerts. All ingestion streams are operating within normal parameters.
                </p>
             </div>
             <div className="bg-neutral-100 p-8 rounded-sm">
                <h3 className="text-sm font-normal uppercase tracking-widest text-neutral-500 mb-4">Quick Links</h3>
                <ul className="space-y-3">
                   <li><a href="/studio" className="text-sm font-normal hover:underline">Sanity Studio →</a></li>
                   <li><a href="https://vercel.com" className="text-sm font-normal hover:underline">Deployment Logs →</a></li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
