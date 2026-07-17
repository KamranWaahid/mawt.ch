import { getPostBySlug } from "@/lib/sanity.queries";
import { getDictionary } from "@/get-dictionary";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import { fr as frLocale, enUS } from "date-fns/locale";
import { urlForImage } from "@/lib/sanity.image";
import Image from "next/image";
import { SectionReveal } from "@/components/ui/section-reveal";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { CurtainLink } from "@/components/ui/curtain-link";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import { JsonLd, articleLd, breadcrumbLd, SITE_URL } from "@/components/seo/structured-data";
import { localizedHref } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const post = await getPostBySlug(slug, lang);

  if (!post) return {};

  const imageUrl = post.mainImage
    ? urlForImage(post.mainImage)?.width(1200).height(630).url()
    : null;

  const canonical = `https://mawt.ch/${lang}/${lang === "fr" ? "blog" : "news"}/${slug}`;
  let alternates: Metadata["alternates"] = { canonical };
  if (post.translation?.slug && post.translation.language && post.translation.language !== lang) {
    const twinLang = post.translation.language === "fr" ? "fr" : "en";
    const twinUrl = `https://mawt.ch/${twinLang}/${twinLang === "fr" ? "blog" : "news"}/${post.translation.slug}`;
    const frUrl = lang === "fr" ? canonical : twinUrl;
    const enUrl = lang === "en" ? canonical : twinUrl;
    alternates = {
      canonical,
      languages: { fr: frUrl, en: enUrl, "x-default": enUrl },
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: "article",
      locale: lang === "fr" ? "fr_CH" : "en_US",
      images: imageUrl ? [imageUrl] : [],
    },
    twitter: { title: post.title, description: post.excerpt || post.title },
  };
}

const articlePortableText = {
  block: {
    h1: ({ children }: any) => (
      <h2 className="mt-14 mb-6 text-[clamp(1.6rem,2.8vw,2.2rem)] font-medium tracking-tight text-white">
        {children}
      </h2>
    ),
    h2: ({ children }: any) => (
      <h2 className="mt-14 mb-6 text-[clamp(1.5rem,2.6vw,2rem)] font-medium tracking-tight text-white">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-10 mb-4 text-[clamp(1.25rem,2vw,1.55rem)] font-medium tracking-tight text-white">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="mt-8 mb-3 text-[1.1rem] font-medium tracking-tight text-white/90">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="mb-6 text-[17px] font-normal leading-[1.75] text-white/58 md:text-[18px]">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-12 border-l border-[#75DAB4]/70 pl-6 text-[18px] font-normal leading-relaxed text-white/55 md:pl-8 md:text-[20px]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-6 list-disc space-y-2 pl-6 text-[17px] text-white/55">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 text-[17px] text-white/55">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-white/55">{children}</li>,
    number: ({ children }: any) => <li className="text-white/55">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-normal text-white">{children}</strong>,
    em: ({ children }: any) => <em className="not-italic text-white/80">{children}</em>,
    highlight: ({ children }: any) => <mark className="bg-[#75DAB4]/20 text-white">{children}</mark>,
    link: ({ children, value }: any) => {
      const href = value?.href || "#";
      if (href.startsWith("/")) {
        return (
          <Link href={href} className="text-[#75DAB4] underline transition-colors hover:text-white">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#75DAB4] underline transition-colors hover:text-white"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    code: ({ value }: any) => (
      <div className="relative my-12">
        <div className="absolute -top-3 left-4 z-10 border border-white/10 bg-[#161616] px-2 py-1 text-[10px] font-normal tracking-wide text-white/40">
          {value?.language || "code"}
        </div>
        <div className="overflow-x-auto border border-white/10 bg-[#111] p-6 font-mono text-[13px] leading-relaxed text-white/75 md:p-8">
          <pre>
            <code>{value?.code}</code>
          </pre>
        </div>
      </div>
    ),
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const [post, dict] = await Promise.all([
    getPostBySlug(slug, lang),
    getDictionary(locale),
  ]);

  if (!post?._id) {
    notFound();
  }

  const blogSegment = lang === "fr" ? "blog" : "news";
  const newsHref = `/${lang}/${blogSegment}`;
  const postUrl = `${SITE_URL}/${lang}/${blogSegment}/${slug}`;
  const articleImage = post.mainImage
    ? urlForImage(post.mainImage)?.width(1200).height(630).url()
    : null;
  const mainImage = post.mainImage
    ? urlForImage(post.mainImage)?.width(1600).height(900).url()
    : null;
  const authorAvatarSmall = post.author?.avatar
    ? urlForImage(post.author.avatar)?.width(100).height(100).url()
    : null;
  const authorAvatarLarge = post.author?.avatar
    ? urlForImage(post.author.avatar)?.width(200).height(200).url()
    : null;

  const postLd = articleLd({
    url: postUrl,
    headline: post.title,
    description: post.excerpt,
    image: articleImage ?? undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    authorName: post.author?.name,
    lang: locale,
  });
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: lang === "fr" ? "Actualités" : "News", url: `${SITE_URL}${newsHref}` },
    { name: post.title, url: postUrl },
  ]);

  const publishedLabel = format(new Date(post.publishedAt), "d MMMM yyyy", {
    locale: lang === "fr" ? frLocale : enUS,
  });

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={[crumbLd, postLd]} />

      <article>
        <header className="pb-10 pt-[22vh] md:pb-14">
          <div className="site-container-xwide">
            <Link
              href={newsHref}
              className="group mb-10 inline-flex items-center gap-2 text-[13px] font-normal text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              {dict.insights.backToInsights}
            </Link>

            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-9">
                {(post.categories?.length ?? 0) > 0 && (
                  <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2">
                    {(post.categories ?? []).map((cat: string) => (
                      <span
                        key={cat}
                        className="text-[12px] font-normal tracking-wide text-[#75DAB4]/90"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="max-w-[18ch] text-[clamp(2.4rem,5vw,4.4rem)] font-medium leading-[1.02] tracking-tight text-white">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="mt-7 max-w-[46ch] text-[16px] font-normal leading-relaxed text-white/55 md:text-[17px]">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-white/10 py-6 text-[13px] text-white/45">
              <div className="flex items-center gap-3">
                {authorAvatarSmall ? (
                  <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src={authorAvatarSmall}
                      alt={post.author?.name ?? dict.insights.teamFallback}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <DarkPageIcon icon={UserRound} className="!h-9 !w-9" />
                )}
                <div>
                  <p className="text-white/80">
                    {post.author?.name || dict.insights.teamFallback}
                  </p>
                  {post.author?.role && (
                    <p className="text-[12px] text-white/35">{post.author.role}</p>
                  )}
                </div>
              </div>
              <div className="inline-flex items-center gap-2">
                <CalendarDays size={14} strokeWidth={1.5} aria-hidden="true" />
                <time dateTime={post.publishedAt}>{publishedLabel}</time>
              </div>
            </div>
          </div>
        </header>

        <SlidePageBody>
          {mainImage && (
            <div className="site-container-xwide mb-14 md:mb-20">
              <SectionReveal className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-white/[0.03]">
                <Image
                  src={mainImage}
                  alt={post.mainImage?.alt || post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </SectionReveal>
            </div>
          )}

          <section className="pb-16 md:pb-24">
            <div className="site-container-xwide">
              <div className="mx-auto max-w-[720px]">
                <SectionReveal>
                  <PortableText value={post.body} components={articlePortableText} />
                </SectionReveal>
              </div>
            </div>
          </section>

          {post.author?.bio && (
            <section className="border-y border-white/10 bg-[#1d1d1d] py-16 md:py-24">
              <div className="site-container-xwide">
                <div className="mx-auto flex max-w-[720px] flex-col gap-6 md:flex-row md:items-start md:gap-8">
                  {authorAvatarLarge && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 md:h-20 md:w-20">
                      <Image
                        src={authorAvatarLarge}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-[18px] font-medium tracking-tight text-white">
                        {dict.insights.writtenBy} {post.author.name}
                      </h2>
                      <p className="mt-2 text-[14px] font-normal leading-relaxed text-white/50">
                        {post.author.bio}
                      </p>
                    </div>
                    {post.author.socialLinks && post.author.socialLinks.length > 0 && (
                      <div className="flex gap-2">
                        {post.author.socialLinks.map((link: { platform: string; url: string }, i: number) => {
                          const Icon = (Icons as any)[link.platform] || Icons.Globe;
                          return (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={link.platform}
                              className="flex h-10 w-10 items-center justify-center text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                            >
                              <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="py-20 md:py-28">
            <div className="site-container-xwide">
              <SectionReveal>
                <h2 className="max-w-[16ch] text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.05] tracking-tight text-white">
                  {dict.insights.statement}
                </h2>
                <div className="mt-10 flex flex-wrap gap-4">
                  <CurtainLink
                    href={localizedHref("contact", locale)}
                    className="inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                  >
                    {dict.insights.statementCta}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                      <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </CurtainLink>
                  <Link
                    href={newsHref}
                    className="inline-flex items-center gap-2 border border-white/20 px-6 py-3.5 text-[13px] font-normal text-white/70 transition-colors hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                  >
                    {dict.insights.backToInsights}
                  </Link>
                </div>
              </SectionReveal>
            </div>
          </section>
        </SlidePageBody>
      </article>
    </div>
  );
}
