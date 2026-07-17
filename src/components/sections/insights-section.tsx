"use client";

import { motion } from "motion/react";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { sectionTitleDarkClass } from "@/components/ui/section-title-style";
import { ArrowRight } from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { BlogPost } from "@/lib/types";

type InsightsDict = {
  headline?: string;
  fallbackCategory?: string;
  recentLabel?: string;
  readTimeUnit?: string;
  fallbackExcerpt?: string;
};

const getPortableTextWordCount = (blocks?: unknown[]) => {
  if (!Array.isArray(blocks)) return 0;

  return blocks.reduce<number>((count, block) => {
    if (!block || typeof block !== "object" || !("children" in block)) return count;
    const children = (block as { children?: unknown[] }).children;
    if (!Array.isArray(children)) return count;

    return count + children.reduce<number>((childCount, child) => {
      if (!child || typeof child !== "object" || !("text" in child)) return childCount;
      const text = (child as { text?: unknown }).text;
      if (typeof text !== "string") return childCount;
      return childCount + text.trim().split(/\s+/).filter(Boolean).length;
    }, 0);
  }, 0);
};

const getReadTime = (post: BlogPost, unitLabel: string) => {
  const bodyWords = getPortableTextWordCount(post.body);
  const excerptWords = post.excerpt?.trim().split(/\s+/).filter(Boolean).length || 0;
  const minutes = Math.max(1, Math.ceil((bodyWords || excerptWords || 180) / 220));

  return `${minutes} ${unitLabel}`;
};

const formatCategory = (category: string | undefined, fallbackCategory: string) => {
  if (!category) return fallbackCategory;

  return category
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatPostDate = (publishedAt: string | undefined, lang: string, recentLabel: string) => {
  if (!publishedAt) return recentLabel;

  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(publishedAt));
};

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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function InsightsSection({ dict, posts }: { dict: InsightsDict; posts?: BlogPost[] }) {
  const params = useParams();
  const currentLang = (params?.lang as string) || "en";
  const fallbackCategory = dict?.fallbackCategory || "Insight";
  const recentLabel = dict?.recentLabel || "Recent";
  const readTimeUnit = dict?.readTimeUnit || "min read";

  if (!posts?.length) {
    return null;
  }

  const displayItems = posts.slice(0, 3).map((post) => ({
    id: post._id,
    category: formatCategory(post.categories?.[0], fallbackCategory),
    title: post.title,
    date: formatPostDate(post.publishedAt, post.language || currentLang, recentLabel),
    readTime: getReadTime(post, readTimeUnit),
    excerpt: post.excerpt || dict?.fallbackExcerpt,
    // FR public slug is /blog (rewritten to the news folder by the proxy).
    href: `/${post.language || currentLang}/${(post.language || currentLang) === "fr" ? "blog" : "news"}/${post.slug}`,
  }));

  return (
    <section className="border-t border-white/10 bg-[#1d1d1d] py-12 md:py-18 lg:py-24">
      <div className="site-container">
        <div className="mb-8 md:mb-10 lg:mb-14">
          <AnimatedTitle
            as="h2"
            text={dict?.headline || "Latest from the team"}
            className={sectionTitleDarkClass}
            splitBy="word"
          />
        </div>

        <motion.div
          className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayItems.map((item) => (
            <motion.article
              key={item.id}
              variants={itemVariants}
              className="group relative flex flex-col bg-[#1d1d1d] p-8 transition-colors duration-300 hover:bg-[#222]"
            >
              <Link href={item.href} className="flex h-full flex-col justify-between">
                <div className="space-y-5 pb-8">
                  <span className="block text-[11px] font-medium tracking-wide text-white/40">
                    {item.category}
                  </span>

                  <h3 className="text-lg-fluid font-medium leading-tight text-white transition-colors group-hover:text-[#75DAB4]">
                    {item.title}
                  </h3>

                  <div className="text-[12px] font-normal tracking-wide text-white/30">
                    {item.date} • {item.readTime}
                  </div>

                  <p className="line-clamp-3 text-sm-fluid font-normal leading-relaxed text-white/50">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors group-hover:border-white/30 group-hover:bg-white/[0.12]">
                  <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
