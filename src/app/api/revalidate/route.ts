import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// Security token for internal/webhook use
const REVALIDATE_TOKEN = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: Request) {
  // Rate Limit: 20 revalidations per minute per IP
  const limiter = await rateLimit("revalidate", 20, 60 * 1000);
  if (!limiter.success) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (token !== REVALIDATE_TOKEN) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const type = body._type;
    const slug = body.slug?.current;

    logger.info(`Revalidating content`, { type, slug });

    // Map Sanity types to Next.js cache tags
    if (type === "project") {
      revalidateTag("project", "default");
      revalidateTag("home", "default"); // Home shows projects
      if (slug) revalidateTag(`project:${slug}`, "default");
    } else if (type === "doc") {
      revalidateTag("docs", "default");
      if (slug) revalidateTag(`doc:${slug}`, "default");
    } else if (type === "dictionary") {
      revalidateTag("dictionary", "default");
      const lang = body.language;
      if (lang) revalidateTag(`dictionary:${lang}`, "default");
    } else if (type === "career") {
      revalidateTag("careers", "default");
    } else if (type === "faq") {
      // getFAQs caches under "faq" + "faq:<lang>" — "faqs" matched nothing.
      revalidateTag("faq", "default");
      if (body.language) revalidateTag(`faq:${body.language}`, "default");
    } else if (type === "pricingPlan") {
      revalidateTag("pricing", "default");
    } else if (type === "author") {
      revalidateTag("docs", "default"); // Authors affect docs
    } else if (type === "siteSettings" || type === "aboutContent" || type === "testimonial" || type === "service") {
      revalidateTag("home", "default");
    } else {
      // Fallback for other types
      revalidateTag(type, "default");
    }

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      type,
      slug 
    });
  } catch (err) {
    logger.error("Revalidation error", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}

// Manual GET endpoint for testing/emergency
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const token = searchParams.get("token");

  if (token !== REVALIDATE_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ message: "Tag required" }, { status: 400 });
  }

  revalidateTag(tag, "default");
  return NextResponse.json({ revalidated: true, tag });
}
