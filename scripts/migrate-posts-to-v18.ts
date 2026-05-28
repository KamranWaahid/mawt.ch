import { createClient } from "@sanity/client";

const token =
  process.env.SANITY_WRITE_TOKEN?.trim() ||
  process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!token) {
  console.error(
    "Missing Sanity write token. Set SANITY_WRITE_TOKEN or SANITY_API_WRITE_TOKEN.",
  );
  console.error(
    "Create one at https://sanity.io/manage → Project ewciugup → API → Tokens (Editor permissions).",
  );
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "ewciugup",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2024-01-01",
  token,
  useCdn: false,
});

type PostDoc = {
  _id: string;
  title: string;
  slug: { current: string };
  language?: string;
  category?: string;
  tags?: string[];
  categories?: string[];
};

async function migrate() {
  const posts = await client.fetch<PostDoc[]>(
    `*[_type == "post"]{
      _id,
      title,
      slug,
      language,
      category,
      tags,
      categories
    } | order(slug.current asc)`,
  );

  console.log(`Found ${posts.length} posts to migrate\n`);

  if (posts.length === 0) {
    console.log("Nothing to migrate.");
    return;
  }

  console.log("BEFORE migration:");
  printPostTable(posts);

  for (const post of posts) {
    const newCategory = "opinions";

    await client
      .patch(post._id)
      .set({ category: newCategory })
      .unset(["categories"])
      .commit();

    console.log(`✏️  Migrated: ${post.slug.current} → category=${newCategory}`);
  }

  const after = await client.fetch<PostDoc[]>(
    `*[_type == "post"]{
      _id,
      title,
      slug,
      language,
      category,
      tags,
      categories
    } | order(slug.current asc)`,
  );

  console.log("\nAFTER migration:");
  printPostTable(after);
}

function printPostTable(posts: PostDoc[]) {
  console.table(
    posts.map((post) => ({
      title: post.title,
      slug: post.slug?.current ?? "(missing)",
      language: post.language ?? "(unset)",
      category: post.category ?? "(unset)",
      tags: post.tags?.length ? post.tags.join(", ") : "(none)",
      categories_removed: post.categories == null ? "yes" : JSON.stringify(post.categories),
    })),
  );
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
