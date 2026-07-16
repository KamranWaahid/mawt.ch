#!/usr/bin/env node
/**
 * SEO regression checks against the SSR HTML (no browser, curl-grade).
 * From the 2026-07-16 audit's "checks CI scriptables" (ACTION-PLAN item 27).
 *
 * Usage:
 *   node scripts/seo-check.mjs                       # against http://localhost:3000
 *   BASE_URL=https://mawt.ch node scripts/seo-check.mjs
 *
 * Exit code 1 if any check fails — safe to wire into CI.
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";
const DELAY_MS = 300;

// Key pages (EN/FR pairs). Extend as templates are added.
const PAGES = [
  { path: "/en", lang: "en" },
  { path: "/fr", lang: "fr" },
  { path: "/en/services", lang: "en" },
  { path: "/fr/services", lang: "fr" },
  { path: "/en/services/ai-solutions/ai-agent", lang: "en" },
  { path: "/fr/services/solutions-ia/agent-ia-assistant", lang: "fr" },
  { path: "/en/geneva", lang: "en" },
  { path: "/fr/geneve", lang: "fr" },
  { path: "/en/about", lang: "en" },
  { path: "/en/contact", lang: "en" },
  { path: "/en/faqs", lang: "en" },
  { path: "/en/work", lang: "en" },
  { path: "/en/news", lang: "en" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const failures = [];
let checks = 0;

function check(page, name, ok, detail = "") {
  checks++;
  if (!ok) failures.push(`${page} — ${name}${detail ? ` (${detail})` : ""}`);
}

function attr(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

async function fetchHtml(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return { status: res.status, html: res.status === 200 ? await res.text() : "" };
}

for (const { path, lang } of PAGES) {
  const { status, html } = await fetchHtml(path);
  check(path, "HTTP 200", status === 200, `got ${status}`);
  if (status !== 200) { await sleep(DELAY_MS); continue; }

  // 1. <html lang> matches the URL locale.
  const htmlLang = attr(html, /<html[^>]*\slang="([^"]+)"/i);
  check(path, "html lang matches locale", htmlLang === lang, `lang="${htmlLang}"`);

  // 2. Title present, no doubled brand suffix, sane length.
  const title = attr(html, /<title>([^<]*)<\/title>/i) || "";
  check(path, "title present", title.length > 0);
  check(path, "no doubled '| MAWT'", !/\|\s*MAWT.*\|\s*MAWT/i.test(title), title);
  check(path, "title 15-75 chars", title.length >= 15 && title.length <= 75, `${title.length}c`);

  // 3. Meta description present, 80-170 chars.
  const desc =
    attr(html, /<meta name="description" content="([^"]*)"/i) ??
    attr(html, /<meta content="([^"]*)" name="description"/i);
  check(path, "meta description present", !!desc);
  if (desc) check(path, "description 80-170 chars", desc.length >= 80 && desc.length <= 170, `${desc.length}c`);

  // 4. og:url equals the canonical URL.
  const canonical =
    attr(html, /<link rel="canonical" href="([^"]*)"/i) ??
    attr(html, /<link href="([^"]*)" rel="canonical"/i);
  const ogUrl =
    attr(html, /<meta property="og:url" content="([^"]*)"/i) ??
    attr(html, /<meta content="([^"]*)" property="og:url"/i);
  if (canonical && ogUrl) check(path, "og:url = canonical", ogUrl === canonical, `${ogUrl} vs ${canonical}`);

  // 5. Exactly one LocalBusiness node per page (the global @graph's).
  const lbCount = (html.match(/"@type":"LocalBusiness"/g) || []).length;
  check(path, "exactly 1 LocalBusiness", lbCount === 1, `${lbCount}`);

  // 6. No deprecated/false markup regressions.
  check(path, "no SearchAction", !html.includes('"@type":"SearchAction"'));
  check(path, "no HowTo schema", !html.includes('"@type":"HowTo"'));

  // 7. NAP visible sitewide (footer).
  check(path, "NAP visible (Fontenette)", html.includes("Fontenette"));

  // 8. hreflang self-reference: when alternates exist, the set contains this page.
  const hreflangs = [...html.matchAll(/hrefLang="([^"]+)"\s+href="([^"]+)"/gi)]
    .concat([...html.matchAll(/href="([^"]+)"\s+hrefLang="([^"]+)"/gi)].map((m) => [m[0], m[2], m[1]]));
  if (hreflangs.length) {
    const urls = hreflangs.map((m) => m[2]);
    check(path, "hreflang self-reference", urls.some((u) => u.endsWith(path)), urls.join(", "));
  }

  await sleep(DELAY_MS);
}

// 9. Homepage-specific: knowsAbout present, SEO paragraph extractable once
// (data-nosnippet on the responsive twins).
{
  const { status, html } = await fetchHtml("/en");
  if (status === 200) {
    check("/en", "knowsAbout in @graph", html.includes('"knowsAbout"'));
    const nosnippet = (html.match(/data-nosnippet/g) || []).length;
    check("/en", "2 data-nosnippet hero twins", nosnippet === 2, `${nosnippet}`);
  }
}

console.log(`\n${checks} checks on ${PAGES.length} pages — ${failures.length} failure(s)\n`);
for (const f of failures) console.error(`  ✗ ${f}`);
if (!failures.length) console.log("  ✓ all green");
process.exit(failures.length ? 1 : 0);
