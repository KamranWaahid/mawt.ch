import { MetadataRoute } from "next";

/**
 * robots.txt — GEO strategy: AI crawlers are EXPLICITLY allowed (we WANT to be
 * cited in AI Overviews / Perplexity / ChatGPT answers). Studio, admin and API
 * are kept out of the index.
 */
const DISALLOW = ["/studio", "/admin", "/api/", "/private/"];

// Major AI / answer-engine crawlers we explicitly welcome.
const AI_BOTS = [
  "GPTBot", // OpenAI training
  "OAI-SearchBot", // OpenAI search
  "ChatGPT-User", // ChatGPT browsing
  "ClaudeBot", // Anthropic
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Gemini / Vertex grounding
  "Applebot-Extended",
  "CCBot", // Common Crawl (feeds many LLMs)
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: everyone may crawl the public site.
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      // AI engines: same access, stated explicitly so intent is unambiguous.
      { userAgent: AI_BOTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: "https://mawt.ch/sitemap.xml",
    host: "https://mawt.ch",
  };
}
