import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

export default async function TutorialIndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 pt-32 bg-white text-black font-sans">
      <Link href="/" className="text-sm text-neutral-400 hover:text-black mb-8 block transition-colors">
        ← Back to MAWT Main Site
      </Link>
      <h1 className="text-4xl font-bold mb-8 tracking-tighter">Tutorial Posts</h1>
      <ul className="flex flex-col gap-y-6">
        {posts.map((post) => (
          <li className="group" key={post._id}>
            <Link href={`/tutorial/${post.slug.current}`}>
              <h2 className="text-xl font-semibold group-hover:text-[#75DAB4] transition-colors">{post.title}</h2>
              <p className="text-neutral-400 text-sm">{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
      {posts.length === 0 && (
        <p className="text-neutral-500 italic mt-8">No posts found. Please create and publish a post in the Studio first.</p>
      )}
    </main>
  );
}
