import { PortableText } from "@portabletext/react";
import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

const options = { next: { revalidate: 30 } };

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
    strong: ({ children }: any) => <strong className="font-normal text-black">{children}</strong>,
    link: ({ children, value }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-brand-teal underline hover:text-black transition-colors">
        {children}
      </a>
    ),
  },
  types: {
    code: ({ value }: any) => (
      <div className="relative group my-12">
        <div className="absolute -top-3 left-4 px-2 py-1 bg-white border border-black/5 text-[10px] font-normal uppercase tracking-widest text-neutral-400 z-10">
           {value?.language || 'code'}
        </div>
        <div className="p-8 bg-neutral-900 text-neutral-100 font-mono text-[14px] leading-relaxed overflow-x-auto rounded-sm">
          <pre><code>{value?.code}</code></pre>
        </div>
      </div>
    ),
  },
};

export default async function TutorialPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug }, options);

  if (!post) {
    notFound();
  }

  const postImageUrl = post.image
    ? urlFor(post.image).width(800).height(450).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 pt-32 bg-white text-black font-sans">
      <Link href="/tutorial" className="text-sm text-neutral-400 hover:text-black mb-8 block transition-colors">
        ← Back to tutorial posts
      </Link>
      
      {postImageUrl && (
        <div className="mb-8 aspect-video relative overflow-hidden rounded-2xl border border-black/5">
          <img
            src={postImageUrl}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      
      <h1 className="text-4xl font-normal mb-4 tracking-tighter leading-tight">{post.title}</h1>
      
      <div className="flex items-center gap-2 text-sm text-neutral-400 mb-12">
        <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
      </div>

      <div className="prose prose-neutral max-w-none text-neutral-800">
        {Array.isArray(post.body) && <PortableText value={post.body} components={components} />}
      </div>
    </main>
  );
}
