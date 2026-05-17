import { getDocBySlug, getDocs } from "@/lib/sanity.queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";

interface DocPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

const components = {
  block: {
    h2: ({ children }: any) => <h2 className="text-3xl font-normal tracking-tight text-black mt-16 mb-8">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-normal text-black mt-10 mb-5">{children}</h3>,
    normal: ({ children }: any) => <p className="text-[17px] text-neutral-600 font-normal leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-brand-teal pl-8 py-2 italic text-neutral-500 my-12">
        {children}
      </blockquote>
    ),
  },
  types: {
    code: ({ value }: any) => (
      <div className="relative group my-12">
        <div className="absolute -top-3 left-4 px-2 py-1 bg-white border border-black/5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 z-10">
           {value.language || 'code'}
        </div>
        <div className="p-8 bg-neutral-900 text-neutral-100 font-mono text-[14px] leading-relaxed overflow-x-auto rounded-sm">
          <pre><code>{value.code}</code></pre>
        </div>
      </div>
    ),
  },
};

export default async function DynamicDocPage({ params }: DocPageProps) {
  const { lang, slug } = await params;
  const [doc, allDocs] = await Promise.all([
    getDocBySlug(slug),
    getDocs()
  ]);

  if (!doc?._id) {
    notFound();
  }

  // Calculate Next/Prev for Learning Path
  const currentIndex = allDocs.findIndex(d => d.slug === slug);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <article className="flex flex-col">
      <SectionReveal>
        <nav className="flex items-center gap-2 mb-12 text-[13px] font-normal text-neutral-400">
          <Link href={`/${lang}/docs`} className="hover:text-black transition-colors">Documentation</Link>
          <span>/</span>
          <span className="text-neutral-300 capitalize">{doc.group?.replace('-', ' ')}</span>
          <span>/</span>
          <span className="text-black font-medium">{doc.title}</span>
        </nav>

        <div className="flex flex-col gap-8 mb-16">
           <div className="flex flex-wrap items-center gap-6 text-[13px] text-neutral-400">
              {doc.estimatedReadTime && (
                <div className="flex items-center gap-2">
                   <Clock size={14} />
                   <span>{doc.estimatedReadTime} min read</span>
                </div>
              )}
              {doc.category && (
                <div className="flex items-center gap-2">
                   <Tag size={14} />
                   <span className="capitalize">{doc.category}</span>
                </div>
              )}
           </div>
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tighter text-black leading-[1.1]">
             {doc.title}
           </h1>
           {doc.excerpt && (
             <p className="text-xl text-neutral-500 font-normal leading-relaxed max-w-[700px]">
                {doc.excerpt}
             </p>
           )}
        </div>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <div className="prose prose-neutral max-w-none">
          <PortableText value={doc.content} components={components} />
        </div>
      </SectionReveal>

      {/* Learning Path Progression */}
      <SectionReveal delay={0.2} className="mt-24 pt-16 border-t border-black/5">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {prevDoc ? (
              <Link 
                href={`/${lang}/docs/${prevDoc.slug}`}
                className="group p-8 border border-black/5 hover:border-black/10 transition-all flex flex-col gap-4"
              >
                 <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black transition-colors">
                    <ArrowLeft size={12} />
                    Previous
                 </div>
                 <span className="text-xl font-normal text-black">{prevDoc.title}</span>
              </Link>
            ) : <div />}

            {nextDoc && (
              <Link 
                href={`/${lang}/docs/${nextDoc.slug}`}
                className="group p-8 border border-black/5 hover:border-black/10 transition-all flex flex-col gap-4 text-right items-end"
              >
                 <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black transition-colors">
                    Next
                    <ArrowRight size={12} />
                 </div>
                 <span className="text-xl font-normal text-black">{nextDoc.title}</span>
              </Link>
            )}
         </div>
      </SectionReveal>
    </article>
  );
}

