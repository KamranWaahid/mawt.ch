"use client";

import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/section-reveal";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { BlogPost } from "@/lib/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  },
};

export function InsightsSection({ dict, posts }: { dict: any; posts?: BlogPost[] }) {
  const params = useParams();
  const currentLang = (params?.lang as string) || "en";

  // Use Sanity posts if available (slice to 3), otherwise fallback to dict.articles (slice to 3)
  const displayItems = posts && posts.length > 0 
    ? posts.slice(0, 3).map((post) => ({
        id: post._id,
        category: post.categories?.[0] || "Insight",
        title: post.title,
        date: post.publishedAt 
          ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
          : "Recent",
        readTime: "5 min read",
        excerpt: post.excerpt || "Explore the latest insights and strategic perspectives from our technical execution team.",
        href: `/${currentLang}/blog/${post.slug}`,
      }))
    : (dict?.articles || []).slice(0, 3).map((article: any, idx: number) => ({
        id: `dict-${idx}`,
        category: article.category,
        title: article.title,
        date: article.date,
        readTime: article.readTime,
        excerpt: article.excerpt,
        href: `/${currentLang}/blog`,
      }));

  return (
    <section className="bg-bg-light py-[120px] border-t border-black/5">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        <SectionReveal>
          {/* Header Badge */}
          <div className="mb-12 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
            <div className="rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1.5 backdrop-blur-sm">
              <span className="text-[10px] font-normal tracking-[0.2em] text-black/80">{dict?.badge || "INSIGHTS"}</span>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-16">
            <h2 className="text-3xl font-normal tracking-tight text-black sm:text-4xl md:text-[44px] lg:leading-[1.1]">
              {dict?.headline || "Latest from the team"}
            </h2>
          </div>

          {/* Insights Grid */}
          <motion.div 
            className="grid gap-px bg-black/5 sm:grid-cols-2 lg:grid-cols-3 border border-black/5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {displayItems.map((item: any) => (
              <motion.article
                key={item.id}
                variants={itemVariants}
                className="group relative flex flex-col bg-white p-10 transition-all duration-300 hover:z-10"
              >
                <Link href={item.href} className="flex h-full flex-col justify-between">
                  <div className="space-y-6 pb-12">
                    <span className="block text-[11px] font-normal text-black/30 tracking-[0.2em] uppercase">
                      {item.category}
                    </span>
                    
                    <h3 className="text-xl font-normal leading-tight text-black md:text-2xl group-hover:text-brand-teal transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="text-[12px] text-black/30 font-normal tracking-wide">
                      {item.date} • {item.readTime}
                    </div>
                    
                    <p className="text-base font-normal leading-relaxed text-black/60 line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                  
                  <div className="mt-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black transition-all group-hover:bg-brand-teal group-hover:text-black">
                    <span className="text-lg">→</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}
