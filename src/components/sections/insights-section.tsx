"use client";

import { motion } from "motion/react";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { sectionTitleClass } from "@/components/ui/section-title-style";

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
        excerpt: post.excerpt || "Field notes on AI in business and automation, from the team that builds the systems.",
        href: `/${currentLang}/news/${post.slug}`,
      }))
    : (dict?.articles || []).slice(0, 3).map((article: any, idx: number) => ({
        id: `dict-${idx}`,
        category: article.category,
        title: article.title,
        date: article.date,
        readTime: article.readTime,
        excerpt: article.excerpt,
        href: `/${currentLang}/news`,
      }));

  return (
    <section className="py-12 md:py-18 lg:py-24">
      <div className="site-container">
        {/* Headline */}
        <div className="mb-8 md:mb-10 lg:mb-14">
          <AnimatedTitle
            as="h2"
            text={dict?.headline || "Latest from the team"}
            className={sectionTitleClass}
            splitBy="word"
          />
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
                className="group relative flex flex-col bg-white p-8 transition-all duration-300 hover:z-10"
              >
                <Link href={item.href} className="flex h-full flex-col justify-between">
                  <div className="space-y-5 pb-8">
                    <span className="block text-[11px] font-medium text-black/40 tracking-wide">
                      {item.category}
                    </span>
                    
                    <h3 className="text-lg-fluid font-medium leading-tight text-black group-hover:text-brand-teal transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="text-[12px] text-black/30 font-normal tracking-wide">
                      {item.date} • {item.readTime}
                    </div>
                    
                    <p className="text-sm-fluid font-normal leading-relaxed text-black/50 line-clamp-3">
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
      </div>
    </section>
  );
}
