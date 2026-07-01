"use client";

import dynamic from "next/dynamic";
import config from "../../../../sanity.config";
import { Settings } from "lucide-react";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

export default function StudioPage() {
  const isDemo = config.projectId === "demo-project-id";

  if (isDemo) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="max-w-xl w-full border border-white/10 bg-neutral-900/50 p-12 rounded-3xl backdrop-blur-xl relative overflow-hidden">
          {/* Accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#75DAB4] to-transparent opacity-50" />
          
          <div className="flex flex-col items-center text-center gap-8">
            <div className="h-16 w-16 bg-[#75DAB4]/10 flex items-center justify-center rounded-2xl border border-[#75DAB4]/20">
              <Settings className="text-[#75DAB4]" size={32} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-normal tracking-tighter">Command Center Setup</h1>
              <p className="text-neutral-400 text-sm leading-relaxed">
                The MAWT Admin Panel requires a unique Sanity Project ID to connect to your live database. 
                The current configuration is using placeholder credentials.
              </p>
            </div>

            <div className="w-full space-y-6 text-left bg-black/20 p-8 rounded-2xl border border-white/5">
               <h2 className="text-[11px] font-normal uppercase tracking-widest text-[#75DAB4]">Next Steps</h2>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3 text-xs text-neutral-300">
                   <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#75DAB4]" />
                   <span>Create a project at <a href="https://sanity.io/manage" target="_blank" className="text-white underline hover:text-[#75DAB4]">sanity.io/manage</a></span>
                 </li>
                 <li className="flex items-start gap-3 text-xs text-neutral-300">
                   <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#75DAB4]" />
                   <span>Update your <strong>.env</strong> file with your <strong>Project ID</strong></span>
                 </li>
                 <li className="flex items-start gap-3 text-xs text-neutral-300">
                   <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#75DAB4]" />
                   <span>Add <strong>http://localhost:3000</strong> to CORS origins in Sanity settings</span>
                 </li>
               </ul>
            </div>

            <p className="text-[10px] text-neutral-600 uppercase tracking-[0.3em]">
              Security Level: Configuration Required
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
