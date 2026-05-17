"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { BlogPost } from "@/lib/types";
import { format } from "date-fns";

interface BlogFilterProps {
  posts: BlogPost[];
}

export function BlogFilter({ posts }: BlogFilterProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const params = useParams();
  const currentLang = (params?.lang as string) || "en";

  const categories = useMemo(() => {
    const cats = new Set<string>();
    if (posts && Array.isArray(posts)) {
      posts.forEach(post => {
        if (post?.categories && Array.isArray(post.categories)) {
          post.categories.forEach(cat => cats.add(cat));
        }
      });
    }
    return ["All", ...Array.from(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return [];
    if (activeCategory === "All") return posts;
    return posts.filter(post => post?.categories?.includes(activeCategory));
  }, [activeCategory, posts]);

  return (
    <>
      <section className="bg-white px-6 py-12 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-[13px] tracking-wide font-medium transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-black text-white" 
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-bg-light py-24 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20">
          <motion.div className="grid gap-px bg-black/5 sm:grid-cols-2 lg:grid-cols-3 border border-black/5">
            <AnimatePresence>
              {filteredPosts.map((post, index) => {
                const category = post.categories?.[0] || "Insight";
                const title = post.title || "Untitled Post";
                const date = post.publishedAt ? format(new Date(post.publishedAt), "MMM dd, yyyy") : "Recent";
                const readTime = "5 min read";
                const excerpt = post.excerpt || "Explore the latest insights and strategic perspectives from our technical execution team.";

                return (
                  <motion.article
                    key={post._id || `fallback-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex flex-col bg-white p-10 transition-all duration-300 hover:z-10"
                  >
                    <Link 
                      href={`/${currentLang}/blog/${post.slug || '#'}`}
                      className="flex h-full flex-col justify-between"
                    >
                      <div className="space-y-6 pb-12">
                        <span className="block text-[11px] font-normal text-black/30 tracking-[0.2em] uppercase">
                          {category}
                        </span>
                        
                        <h3 className="text-xl font-normal leading-tight text-black md:text-2xl group-hover:text-brand-teal transition-colors">
                          {title}
                        </h3>
                        
                        <div className="text-[12px] text-black/30 font-normal tracking-wide">
                          {date} • {readTime}
                        </div>
                        
                        <p className="text-base font-normal leading-relaxed text-black/60 line-clamp-3">
                          {excerpt}
                        </p>
                      </div>
                      
                      <div className="mt-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black transition-all group-hover:bg-brand-teal group-hover:text-black">
                        <span className="text-lg">→</span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  );
}
