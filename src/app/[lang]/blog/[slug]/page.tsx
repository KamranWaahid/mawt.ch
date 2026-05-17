import { getPostBySlug } from "@/lib/sanity.queries";
import { ArrowLeft } from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import { urlForImage } from "@/lib/sanity.image";
import Image from "next/image";
import { SectionReveal } from "@/components/ui/section-reveal";
import type { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.mainImage ? [urlForImage(post.mainImage)?.width(1200).height(630).url() || ""] : [],
    },
  };
}

const components = {
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-normal tracking-tight text-black mt-16 mb-8">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-normal tracking-tight text-black mt-16 mb-8">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-normal text-black mt-12 mb-6">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-xl font-normal text-black mt-10 mb-4">{children}</h4>,
    normal: ({ children }: any) => <p className="text-lg text-neutral-600 font-normal leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-brand-teal pl-8 py-2 italic text-neutral-500 my-12">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 text-neutral-600 space-y-2 text-lg">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 text-neutral-600 space-y-2 text-lg">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-neutral-600">{children}</li>,
    number: ({ children }: any) => <li className="text-neutral-600">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-black">{children}</strong>,
    link: ({ children, value }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-brand-teal underline hover:text-black transition-colors">
        {children}
      </a>
    ),
  },
  types: {
    code: ({ value }: any) => (
      <div className="relative group my-12">
        <div className="absolute -top-3 left-4 px-2 py-1 bg-white border border-black/5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 z-10">
           {value?.language || 'code'}
        </div>
        <div className="p-8 bg-neutral-900 text-neutral-100 font-mono text-[14px] leading-relaxed overflow-x-auto rounded-sm">
          <pre><code>{value?.code}</code></pre>
        </div>
      </div>
    ),
  },
};

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ lang: string; slug: string }> 
}) {
  const { lang, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post?._id) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="px-6 pt-32 sm:px-8 md:px-10 lg:px-12">
        <Link 
          href={`/${lang}/blog`}
          className="flex items-center gap-2 text-sm font-normal text-neutral-400 hover:text-black transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>
      </div>

      <article className="px-6 py-16 md:py-24 sm:px-8 md:px-10 lg:px-12">
        <div className="max-w-[800px] mx-auto">
          <SectionReveal className="flex flex-col gap-6 mb-16">
            <div className="flex gap-2">
               {post.categories?.map((cat: string) => (
                 <span key={cat} className="text-[12px] font-semibold text-brand-teal uppercase tracking-widest">{cat}</span>
               ))}
            </div>
            <h1 className="text-4xl font-normal tracking-tight text-black sm:text-5xl md:text-6xl leading-[1.1]">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between py-8 border-y border-black/5">
               <div className="flex items-center gap-4">
                  {post.author?.avatar && (
                    <div className="w-12 h-12 rounded-full bg-neutral-100 overflow-hidden relative">
                       <Image 
                         src={urlForImage(post.author.avatar)?.width(100).height(100).url() || ""}
                         alt={post.author.name}
                         fill
                         className="object-cover"
                       />
                    </div>
                  )}
                  <div className="flex flex-col">
                     <span className="text-[15px] font-normal text-black">{post.author?.name || "Team MAWT"}</span>
                     <span className="text-[13px] font-normal text-neutral-400">{post.author?.role}</span>
                  </div>
               </div>
               <div className="text-[14px] font-normal text-neutral-400">
                  {format(new Date(post.publishedAt), "MMMM dd, yyyy")}
               </div>
            </div>
          </SectionReveal>

          {post.mainImage && (
            <SectionReveal delay={0.1} className="mb-16 aspect-[16/9] relative overflow-hidden rounded-sm border border-black/5">
               <Image 
                 src={urlForImage(post.mainImage)?.width(1600).height(900).url() || ""}
                 alt={post.mainImage.alt || post.title}
                 fill
                 priority
                 className="object-cover"
               />
            </SectionReveal>
          )}

          <SectionReveal delay={0.2}>
            <div className="prose prose-neutral max-w-none text-neutral-800">
               <PortableText value={post.body} components={components} />
            </div>
          </SectionReveal>
        </div>
      </article>

      {/* Author Bio Section */}
      {post.author?.bio && (
        <section className="bg-neutral-50 px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
          <div className="max-w-[800px] mx-auto">
             <div className="flex flex-col md:flex-row gap-8 items-start md:items-center p-8 bg-white border border-black/5 rounded-sm">
                {post.author.avatar && (
                  <div className="w-20 h-20 rounded-full bg-neutral-100 overflow-hidden relative shrink-0">
                     <Image 
                       src={urlForImage(post.author.avatar)?.width(200).height(200).url() || ""}
                       alt={post.author.name}
                       fill
                       className="object-cover"
                     />
                  </div>
                )}
                <div className="space-y-4">
                   <div className="space-y-1">
                      <h3 className="text-xl font-normal text-black">Written by {post.author.name}</h3>
                      <p className="text-neutral-500 font-normal text-sm leading-relaxed">
                         {post.author.bio}
                      </p>
                   </div>
                   {post.author.socialLinks && post.author.socialLinks.length > 0 && (
                     <div className="flex gap-4 pt-2">
                        {post.author.socialLinks.map((link, i) => {
                           const Icon = (Icons as any)[link.platform] || Icons.Globe;
                           return (
                             <Link 
                               key={i} 
                               href={link.url} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-neutral-400 hover:text-brand-teal transition-colors"
                             >
                                <Icon size={18} strokeWidth={1.5} />
                             </Link>
                           );
                        })}
                     </div>
                   )}
                </div>
             </div>
          </div>
        </section>
      )}
    </div>
  );
}
