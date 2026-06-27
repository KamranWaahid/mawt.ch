"use client";

import { motion } from "motion/react";
import Link from "next/link";

interface Article {
  category: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
}

interface BlogGridProps {
  articles: Article[];
}

export function BlogGrid({ articles }: BlogGridProps) {
  return (
    <section className="bg-white px-6 py-16 sm:px-8 md:px-10 lg:px-12">
      <div className="site-container-wide">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ 
                y: { type: "spring", stiffness: 400, damping: 30 },
                opacity: { duration: 0.5, delay: index * 0.1 }
              }}
              className="group flex flex-col gap-6 cursor-none"
              data-cursor="view"
            >
              <div className="aspect-[16/9] bg-neutral-100 border border-black/5 overflow-hidden">
                <div className="h-full w-full bg-neutral-200 transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-[13px] font-normal tracking-tight">
                  <span className="text-black/50 normal-case">{article.category}</span>
                  <span className="text-neutral-400">{article.date} • {article.readTime}</span>
                </div>
                <h3 className="text-lg-fluid font-medium tracking-tight text-black group-hover:text-neutral-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm-fluid leading-relaxed text-neutral-500 font-normal line-clamp-3">
                  {article.excerpt}
                </p>
                <Link 
                  href="#" 
                  className="inline-flex items-center gap-2 text-sm font-normal text-black mt-2 group/link"
                >
                  Read Article 
                  <span className="transition-transform group-hover/link:translate-x-1">→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
