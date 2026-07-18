import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { secureEqual } from "@/lib/secure-compare";
import { logger } from "@/lib/logger";

/**
 * Fail-closed webhook auth: if SANITY_REVALIDATE_SECRET is not configured the
 * endpoint refuses everything (the old `token !== SECRET` check degenerated
 * when the env var was missing). Prefers `Authorization: Bearer <secret>`;
 * the legacy `?token=` query param is still accepted so the existing Sanity
 * webhook keeps working until it's updated (query strings end up in logs —
 * move to the header, see audit checklist).
 */
function verifyRevalidateToken(req: Request): boolean {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    logger.error("SANITY_REVALIDATE_SECRET not set — refusing revalidation");
    return false;
  }
  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : null;
  const queryToken = new URL(req.url).searchParams.get("token");
  const provided = bearer ?? queryToken;
  if (!provided) return false;
  return secureEqual(provided, secret);
}

/** Revalidate a base tag plus its per-language variant when language is known. */
function revalidateWithLang(tag: string, language?: string) {
  revalidateTag(tag, "default");
  if (language) revalidateTag(`${tag}:${language}`, "default");
}

export async function POST(req: Request) {
  // 20 revalidations per minute per IP. failClosed: an unlimited cache-purge
  // endpoint is an ISR-thrash DoS vector, so no limiter must mean no access.
  // (Old code passed 60*1000 — the limiter takes SECONDS, so the window was
  // accidentally ~16 hours.)
  const limiter = await rateLimit("revalidate", 20, 60, { failClosed: true });
  if (!limiter.success) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }
  try {
    if (!verifyRevalidateToken(req)) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const type = body._type;
    const slug = body.slug?.current;
    const language = typeof body.language === "string" ? body.language : undefined;

    logger.info(`Revalidating content`, { type, slug });

    // Map Sanity types to Next.js cache tags (must mirror the `next.tags`
    // used in src/lib/sanity.queries.ts).
    if (type === "project") {
      revalidateTag("project", "default");
      revalidateTag("home", "default"); // Home shows projects
      if (slug) revalidateTag(`project:${slug}`, "default");
    } else if (type === "doc") {
      revalidateTag("docs", "default");
      if (slug) revalidateTag(`doc:${slug}`, "default");
    } else if (type === "post") {
      revalidateWithLang("posts", language);
      if (slug) revalidateTag(`post:${slug}`, "default");
    } else if (type === "dictionary") {
      revalidateWithLang("dictionary", language);
    } else if (type === "career") {
      revalidateTag("careers", "default");
    } else if (type === "faq") {
      // getFAQs caches under "faq" + "faq:<lang>" — "faqs" matched nothing.
      revalidateWithLang("faq", language);
    } else if (type === "pricingPlan") {
      revalidateTag("pricing", "default");
    } else if (type === "author") {
      revalidateTag("docs", "default"); // Authors affect docs
      revalidateWithLang("posts", language); // …and blog posts
    } else if (type === "partner") {
      revalidateTag("partners", "default");
      revalidateTag("home", "default");
    } else if (type === "pageContent") {
      // Per-page tags include the pageKey, which the webhook body doesn't
      // carry — the base tag covers every pageContent fetch.
      revalidateTag("pageContent", "default");
    } else if (type === "aboutContent") {
      revalidateTag("home", "default");
      revalidateWithLang("aboutContent", language);
    } else if (type === "securityPage") {
      revalidateWithLang("securityPage", language);
    } else if (type === "methodPage") {
      revalidateWithLang("methodPage", language);
    } else if (type === "contact") {
      revalidateTag("contact", "default");
    } else if (type === "service") {
      revalidateTag("home", "default");
      revalidateTag("service", "default");
      if (slug) revalidateTag(`service:${slug}`, "default");
    } else if (type === "siteSettings" || type === "testimonial") {
      revalidateTag("home", "default");
    } else if (typeof type === "string" && type.length > 0) {
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
  const limiter = await rateLimit("revalidate", 20, 60, { failClosed: true });
  if (!limiter.success) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  if (!verifyRevalidateToken(req)) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  if (!tag) {
    return NextResponse.json({ message: "Tag required" }, { status: 400 });
  }

  revalidateTag(tag, "default");
  return NextResponse.json({ revalidated: true, tag });
}
