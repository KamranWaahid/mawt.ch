const { chromium } = require("playwright");
const fs = require("fs");

const BASE_URL = "http://localhost:3000";

const widths = [320, 360, 375, 390, 414, 480, 640, 768, 820, 1024, 1280, 1366, 1440, 1536, 1920, 2560];
const heights = [568, 667, 720, 800, 900, 1080, 1440];

const keyViewports = [
  { width: 320, height: 568, name: "Mobile Portrait (Small)" },
  { width: 375, height: 812, name: "Mobile Portrait (Standard)" },
  { width: 768, height: 1024, name: "Tablet Portrait" },
  { width: 1024, height: 768, name: "Tablet Landscape" },
  { width: 1440, height: 900, name: "Laptop/Desktop" },
  { width: 2560, height: 1440, name: "Ultra-wide" }
];

const routes = [
  "/en",
  "/fr",
  "/en/work",
  "/fr/projets",
  "/en/work/diagora",
  "/fr/work/diagora",
  "/fr/projets/diagora",
  "/en/our-process",
  "/fr/notre-methode",
  "/en/services",
  "/fr/services",
  "/en/services/sites-and-branding/e-commerce",
  "/fr/services/sites-et-branding/e-commerce-eshop",
  "/en/news",
  "/fr/blog",
  "/en/news/the-hidden-cost-of-poor-digital-infrastructure",
  "/fr/news/why-most-businesses-struggle-with-digital-growth",
  "/en/about",
  "/fr/a-propos",
  "/en/contact",
  "/fr/contact",
  "/en/login",
  "/fr/login",
  "/en/admin",
  "/fr/admin",
  "/en/nonexistent-page-test-abc",
  "/fr/page-non-existante-test-xyz"
];

async function runAudit() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    bypassCSP: true
  });
  
  const results = {
    pagesTested: [],
    overflowIssues: [],
    consoleErrors: [],
    viewportFailures: [],
    details: []
  };

  console.log("Starting Responsive QA Audit...");

  // 1. Audit all routes at key viewports
  for (const route of routes) {
    const page = await context.newPage();
    const url = `${BASE_URL}${route}`;
    
    // Listen for console errors
    const pageErrors = [];
    page.on("pageerror", err => {
      // Exclude pre-existing or third-party issues that aren't responsive related if any
      pageErrors.push({ type: "pageerror", text: err.message, route });
      console.error(`[Page Error] ${route}:`, err.message);
    });
    page.on("console", msg => {
      if (msg.type() === "error") {
        pageErrors.push({ type: "console-error", text: msg.text(), route });
        console.error(`[Console Error] ${route}:`, msg.text());
      }
    });

    console.log(`Auditing route: ${route}`);

    for (const vp of keyViewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      try {
        const response = await page.goto(url, { waitUntil: "load", timeout: 15000 });
        const status = response ? response.status() : 0;
        
        // Wait a short duration for layout settlement
        await page.waitForTimeout(600);

        // Check horizontal overflow
        const overflowResult = await page.evaluate(() => {
          const htmlOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
          const bodyOverflow = document.body.scrollWidth > document.body.clientWidth;
          return {
            htmlOverflow,
            bodyOverflow,
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth
          };
        });

        const hasOverflow = overflowResult.htmlOverflow || overflowResult.bodyOverflow;
        
        results.details.push({
          route,
          viewport: `${vp.width}x${vp.height}`,
          status,
          hasOverflow,
          overflowDetails: overflowResult,
          errorsCount: pageErrors.length
        });

        if (hasOverflow) {
          results.overflowIssues.push({
            route,
            viewport: `${vp.width}x${vp.height}`,
            details: overflowResult
          });
          console.warn(`[Overflow] ${route} at ${vp.width}x${vp.height}: scrollWidth=${overflowResult.scrollWidth}, clientWidth=${overflowResult.clientWidth}`);
        }
      } catch (err) {
        results.viewportFailures.push({
          route,
          viewport: `${vp.width}x${vp.height}`,
          error: err.message
        });
        console.error(`[Load Failure] ${route} at ${vp.width}x${vp.height}:`, err.message);
      }
    }
    
    if (pageErrors.length > 0) {
      results.consoleErrors.push(...pageErrors);
    }
    results.pagesTested.push(route);
    await page.close();
  }

  // 2. Audit Homepage (/en and /fr) across full 16 x 7 viewport matrix (112 viewport configurations per page)
  const homepages = ["/en", "/fr"];
  for (const pagePath of homepages) {
    const page = await context.newPage();
    const url = `${BASE_URL}${pagePath}`;
    console.log(`Auditing exhaustive viewport matrix for: ${pagePath}`);
    
    try {
      await page.goto(url, { waitUntil: "load", timeout: 15000 });

      for (const w of widths) {
        for (const h of heights) {
          await page.setViewportSize({ width: w, height: h });
          await page.waitForTimeout(100);
          
          const overflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth ||
                   document.body.scrollWidth > document.body.clientWidth;
          });

          if (overflow) {
            results.overflowIssues.push({
              route: pagePath,
              viewport: `${w}x${h}`,
              type: "exhaustive-viewport-matrix"
            });
            console.warn(`[Overflow Exhaustive] ${pagePath} at ${w}x${h}`);
          }
        }
      }
    } catch (e) {
      console.error(`Exhaustive matrix run failed for ${pagePath}:`, e.message);
    }
    await page.close();
  }

  await browser.close();

  // Save JSON report
  fs.writeFileSync("report.json", JSON.stringify(results, null, 2));
  console.log("Responsive QA Audit complete. Report saved to report.json.");
}

runAudit().catch(err => {
  console.error("Audit failed:", err);
  process.exit(1);
});
