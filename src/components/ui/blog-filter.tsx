"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calendar, Clock3, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { fr as frLocale } from "date-fns/locale";
import type { Locale } from "@/i18n-config";
import type { BlogPost } from "@/lib/types";
import { urlForImage } from "@/lib/sanity.image";

type InsightsDict = {
  fallbackCategory: string;
  recentLabel: string;
  readTimeUnit: string;
  fallbackExcerpt: string;
  readArticle: string;
  filterAll: string;
  featuredLabel: string;
};

interface BlogFilterProps {
  posts: BlogPost[];
  dict: InsightsDict;
  lang: Locale;
}

function newsPath(lang: Locale) {
  return lang === "fr" ? "blog" : "news";
}

function postHref(lang: Locale, slug?: string) {
  return `/${lang}/${newsPath(lang)}/${slug || ""}`;
}

function formatPostDate(date: string | undefined, lang: Locale, fallback: string) {
  if (!date) return fallback;
  try {
    return format(new Date(date), lang === "fr" ? "d MMM yyyy" : "MMM d, yyyy", {
      locale: lang === "fr" ? frLocale : undefined,
    });
  } catch {
    return fallback;
  }
}

function estimateReadMinutes(post: BlogPost) {
  const fromBody = Array.isArray(post.body)
    ? post.body.reduce((words, block) => {
        if (block?._type !== "block" || !Array.isArray(block.children)) return words;
        return (
          words +
          block.children.reduce((inner: number, child: { text?: string }) => {
            const text = typeof child?.text === "string" ? child.text : "";
            return inner + text.trim().split(/\s+/).filter(Boolean).length;
          }, 0)
        );
      }, 0)
    : 0;
  const fromExcerpt = (post.excerpt || "").trim().split(/\s+/).filter(Boolean).length;
  const words = fromBody || fromExcerpt || 400;
  return Math.max(1, Math.round(words / 200));
}

export function BlogFilter({ posts, dict, lang }: BlogFilterProps) {
  const [activeCategory, setActiveCategory] = useState(dict.filterAll);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts?.forEach((post) => {
      post?.categories?.forEach((cat) => cats.add(cat));
    });
    return [dict.filterAll, ...Array.from(cats)];
  }, [dict.filterAll, posts]);

  const filteredPosts = useMemo(() => {
    if (!posts?.length) return [];
    if (activeCategory === dict.filterAll) return posts;
    return posts.filter((post) => post?.categories?.includes(activeCategory));
  }, [activeCategory, dict.filterAll, posts]);

  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);

  if (!posts?.length) {
    return null;
  }

  return (
    <section className="pb-[14vh]">
      {/* Category filters — dark-ground, same rhythm as /work */}
      <div className="site-container-xwide mb-16 md:mb-20">
        <div className="flex items-center gap-x-5 gap-y-3 overflow-x-auto pb-1 text-[clamp(0.95rem,1.6vw,1.15rem)] font-normal leading-none md:flex-wrap md:overflow-visible md:pb-0">
          {categories.map((category, index) => (
            <span key={category} className="flex shrink-0 items-center gap-5">
              {index > 0 && <span className="text-white/20">—</span>}
              <button
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`transition-colors ${
                  activeCategory === category ? "text-white" : "text-white/35 hover:text-white/70"
                }`}
              >
                {category}
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="site-container-xwide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {featured ? (
              <FeaturedArticle post={featured} dict={dict} lang={lang} />
            ) : null}

            {rest.length > 0 ? (
              <div className="mt-24 columns-1 gap-x-20 md:mt-28 md:columns-2">
                {rest.map((post, index) => (
                  <ArticleCard
                    key={post._id || post.slug || index}
                    post={post}
                    dict={dict}
                    lang={lang}
                    priority={index < 2}
                  />
                ))}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function FeaturedArticle({
  post,
  dict,
  lang,
}: {
  post: BlogPost;
  dict: InsightsDict;
  lang: Locale;
}) {
  const href = postHref(lang, post.slug);
  const category = post.categories?.[0] || dict.fallbackCategory;
  const date = formatPostDate(post.publishedAt, lang, dict.recentLabel);
  const excerpt = post.excerpt || dict.fallbackExcerpt;
  const readTime = `${estimateReadMinutes(post)} ${dict.readTimeUnit}`;
  const imageSrc = urlForImage(post.mainImage)?.width(1600).height(900).fit("crop").url();

  return (
    <article className="group">
      <Link href={href} className="block" data-cursor="view">
        <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.04] md:aspect-[21/9]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={post.title || ""}
              fill
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
          )}
        </div>
      </Link>

      <div className="mt-8 max-w-[54ch] md:mt-10">
        <p className="text-[13px] font-normal text-white/40">
          <span className="inline-flex items-center gap-2">
            <Newspaper size={13} strokeWidth={1.5} aria-hidden="true" />
            {dict.featuredLabel}
          </span>
          <span className="mx-2 text-white/20">·</span>
          <span>{category}</span>
          <span className="mx-2 text-white/20">·</span>
          <span>{date}</span>
          <span className="mx-2 text-white/20">·</span>
          <span>{readTime}</span>
        </p>

        <h2 className="mt-5 text-[clamp(1.85rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-white">
          <Link href={href} className="transition-colors hover:text-white/80">
            {post.title}
          </Link>
        </h2>

        <p className="mt-5 text-[15px] font-normal leading-relaxed text-white/55">{excerpt}</p>

        <Link
          href={href}
          className="mt-9 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white"
        >
          {dict.readArticle}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
            <ArrowRight size={13} />
          </span>
        </Link>
      </div>
    </article>
  );
}

function ArticleCard({
  post,
  dict,
  lang,
  priority = false,
}: {
  post: BlogPost;
  dict: InsightsDict;
  lang: Locale;
  priority?: boolean;
}) {
  const href = postHref(lang, post.slug);
  const category = post.categories?.[0] || dict.fallbackCategory;
  const date = formatPostDate(post.publishedAt, lang, dict.recentLabel);
  const excerpt = post.excerpt || dict.fallbackExcerpt;
  const readTime = `${estimateReadMinutes(post)} ${dict.readTimeUnit}`;
  const imageSrc = urlForImage(post.mainImage)?.width(1100).height(720).fit("crop").url();

  return (
    <article className="mb-24 break-inside-avoid md:mb-28">
      <Link href={href} className="group block" data-cursor="view">
        <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.04]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={post.title || ""}
              fill
              priority={priority}
              sizes="(min-width: 768px) 46vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
          )}
        </div>
      </Link>

      <h2 className="mt-8 max-w-[22ch] text-[clamp(1.45rem,2.4vw,2rem)] font-semibold leading-[1.08] tracking-tight text-white">
        <Link href={href} className="transition-colors hover:text-white/80">
          {post.title}
        </Link>
      </h2>

      <p className="mt-5 max-w-[46ch] text-[15px] font-normal leading-relaxed text-white/55 line-clamp-3">
        {excerpt}
      </p>

      <ul className="mt-8">
        <li>
          <Link
            href={href}
            className="group flex items-center justify-between gap-6 border-b border-white/10 py-[13px] text-[14px] font-normal text-white/50 transition-colors hover:text-white"
          >
            <span className="inline-flex items-center gap-3">
              <Newspaper size={14} strokeWidth={1.5} className="shrink-0 text-white/35" aria-hidden="true" />
              {category}
            </span>
            <ArrowUpRight
              size={14}
              className="shrink-0 text-white/0 transition-all duration-300 group-hover:text-white/60"
            />
          </Link>
        </li>
        <li className="flex items-center gap-3 border-b border-white/10 py-[13px] text-[14px] font-normal text-white/50">
          <Calendar size={14} strokeWidth={1.5} className="shrink-0 text-white/35" aria-hidden="true" />
          {date}
        </li>
        <li className="flex items-center gap-3 border-b border-white/10 py-[13px] text-[14px] font-normal text-white/50">
          <Clock3 size={14} strokeWidth={1.5} className="shrink-0 text-white/35" aria-hidden="true" />
          {readTime}
        </li>
      </ul>

      <Link
        href={href}
        className="mt-9 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white"
      >
        {dict.readArticle}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
          <ArrowRight size={13} />
        </span>
      </Link>
    </article>
  );
}
