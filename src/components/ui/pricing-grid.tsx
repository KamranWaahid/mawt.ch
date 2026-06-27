"use client";

import { motion } from "motion/react";

interface PricingPlan {
  name: string;
  price: string;
  interval: string;
  description?: string;
  features: string[];
  cta: string;
  recommended?: boolean;
}

interface PricingGridProps {
  plans: PricingPlan[];
}

export function PricingGrid({ plans }: PricingGridProps) {
  return (
    <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12">
      <div className="site-container-wide grid gap-8 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col p-6 sm:p-10 border transition-colors ${
              plan.recommended ? "border-black bg-white" : "border-black/5 bg-white"
            }`}
          >
            <div className="mb-8">
              <h3 className="text-xl font-normal text-black mb-2">{plan.name}</h3>
              <p className="text-neutral-500 text-sm font-normal">{plan.description}</p>
            </div>
            <div className="mb-10">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-normal text-black">{plan.price}</span>
                <span className="text-neutral-400 text-sm font-normal">/{plan.interval}</span>
              </div>
            </div>
            <ul className="flex-grow flex flex-col gap-4 mb-10">
              {plan.features.map((feature) => (
                <li key={feature} className="text-[15px] font-normal text-black flex items-start gap-3">
                  <span className="text-[#75DAB4]">●</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 text-sm font-normal transition-colors border ${
              plan.recommended 
                ? "bg-black text-white border-black hover:bg-neutral-800" 
                : "bg-transparent text-black border-black hover:bg-black hover:text-white"
            }`}>
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
