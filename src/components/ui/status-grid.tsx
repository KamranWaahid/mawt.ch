"use client";

import { motion } from "motion/react";
import { CheckCircle2, AlertCircle, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusItem {
  service: string;
  status: "Operational" | "Degraded" | "Maintenance" | "Down";
  uptime: string;
  latency?: string;
}

interface StatusGridProps {
  items: StatusItem[];
}

// Deterministic pseudo-random per bar index: Math.random() in render made
// the server and client disagree on every bar (hydration mismatch) and
// changed the bars on each re-render.
const pseudoRandom = (seed: number) => Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;

const statusConfig = {
  Operational: {
    color: "bg-[#75DAB4]",
    text: "Operational",
    icon: CheckCircle2,
    light: "bg-[#75DAB4]/10"
  },
  Degraded: {
    color: "bg-yellow-400",
    text: "Degraded Performance",
    icon: AlertCircle,
    light: "bg-yellow-400/10"
  },
  Maintenance: {
    color: "bg-blue-400",
    text: "Maintenance",
    icon: Clock,
    light: "bg-blue-400/10"
  },
  Down: {
    color: "bg-red-500",
    text: "Service Interruption",
    icon: AlertCircle,
    light: "bg-red-500/10"
  }
};

export function StatusGrid({ items }: StatusGridProps) {
  return (
    <div className="w-full">
      <div className="grid gap-4">
        {items.map((item, index) => {
          const config = statusConfig[item.status];

          return (
            <motion.div
              key={item.service}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white border border-black/5 p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-black/10 transition-all duration-500 rounded-sm"
            >
              {/* Service Label */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <div className={cn("h-3 w-3 rounded-full", config.color)} />
                      {item.status === "Operational" && (
                        <div className={cn("absolute inset-0 h-3 w-3 rounded-full animate-ping opacity-40", config.color)} />
                      )}
                   </div>
                   <h3 className="text-xl font-normal text-black tracking-tight">{item.service}</h3>
                </div>
                <div className="flex items-center gap-3 pl-7">
                   <span className={cn("text-[10px] font-normal uppercase tracking-widest px-2 py-0.5 rounded-full", config.light, "text-black/60")}>
                      {config.text}
                   </span>
                </div>
              </div>

              {/* Metrics Visualizer */}
              <div className="flex-1 max-w-md hidden lg:block">
                 <div className="flex items-end gap-1 h-8">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: "40%" }}
                        animate={{ height: `${40 + pseudoRandom(i) * 60}%` }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 1 + pseudoRandom(i + 40),
                          delay: i * 0.05
                        }}
                        className={cn(
                          "w-1 rounded-full opacity-20",
                          item.status === "Operational" ? "bg-[#75DAB4]" : "bg-neutral-300"
                        )}
                      />
                    ))}
                 </div>
              </div>

              {/* Uptime Info */}
              <div className="flex items-center justify-between gap-4 sm:gap-10 md:gap-16 w-full md:w-auto">
                 {item.latency && (
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400">Latency</span>
                      <span className="text-sm font-medium text-black font-mono">{item.latency}</span>
                   </div>
                 )}
                 <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400">90-Day Uptime</span>
                    <span className="text-sm font-medium text-black font-mono">{item.uptime}</span>
                 </div>
                 <div className="p-3 bg-neutral-50 rounded-full text-neutral-400 group-hover:text-black group-hover:bg-neutral-100 transition-all duration-300">
                    <Activity size={18} strokeWidth={1.5} />
                 </div>
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-[#75DAB4] w-0 group-hover:w-full transition-all duration-700" />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 flex items-center justify-between text-neutral-400">
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#75DAB4] animate-pulse" />
            <span className="text-xs font-normal">Real-time system monitoring active</span>
         </div>
         <span className="text-xs font-normal italic">Last refreshed: Just now</span>
      </div>
    </div>
  );
}
