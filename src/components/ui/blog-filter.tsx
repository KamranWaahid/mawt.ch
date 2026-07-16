"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { BlogPost } from "@/lib/types";

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
      <section className="py-8 md:py-10">
        <div className="site-container-wide flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-[13px] tracking-wide font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-black text-white"
                  : "bg-white/55 text-neutral-500 hover:bg-white hover:text-black"
              }`}
            >
              {/* "All" is the internal filter key — display it localized. */}
              {category === "All" ? (currentLang === "fr" ? "Tous" : "All") : category}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-18 lg:py-24">
        <div className="site-container-wide">
          <motion.div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredPosts.map((post, index) => {
                const isFr = currentLang === "fr";
                const category = post.categories?.[0] || (isFr ? "Article" : "Insight");
                const title = post.title || (isFr ? "Article sans titre" : "Untitled Post");
                // Localized date rendering — the FR listing showed EN dates
                // ("May 17, 2026") on /fr/blog.
                const date = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(isFr ? "fr-CH" : "en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : isFr ? "Récent" : "Recent";
                const readTime = isFr ? "5 min de lecture" : "5 min read";
                const excerpt = post.excerpt || (isFr
                  ? "Notes de terrain sur l'IA en entreprise et l'automatisation, par l'équipe qui construit les systèmes."
                  : "Field notes on AI in business and automation, from the team that builds the systems.");

                return (
                  <motion.article
                    key={post._id || `fallback-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex min-h-[320px] flex-col rounded-2xl border border-black/[0.02] bg-white/48 p-6 transition-all duration-300 hover:z-10 hover:bg-white/75 sm:p-8"
                  >
                    <Link 
                      href={`/${currentLang}/${currentLang === "fr" ? "blog" : "news"}/${post.slug || '#'}`}
                      className="flex h-full flex-col justify-between"
                    >
                      <div className="space-y-5 pb-8">
                        <span className="block text-[11px] font-medium text-black/40 tracking-wide">
                          {category}
                        </span>
                        
                        <h3 className="text-lg-fluid font-medium leading-tight text-black group-hover:text-brand-teal transition-colors">
                          {title}
                        </h3>
                        
                        <div className="text-[12px] text-black/30 font-normal tracking-wide">
                          {date} • {readTime}
                        </div>
                        
                        <p className="text-sm-fluid font-normal leading-relaxed text-black/50 line-clamp-3">
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
