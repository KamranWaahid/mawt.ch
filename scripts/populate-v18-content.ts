import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ABOUT_COPY } from "../src/content/about-copy";
import {
  DELETE_SERVICE_SLUGS,
  FAQ_TAG_MAP,
  RENAME_SERVICE_SLUGS,
  V18_SERVICES,
} from "./data/v18-catalog";
import { STANDALONE_PAGES } from "./data/standalone-pages-content";
import { stepSection, textToBlocks } from "./lib/sanity-content-helpers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const token =
  process.env.SANITY_WRITE_TOKEN?.trim() ||
  process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!token) {
  console.error("Missing Sanity write token. Set SANITY_WRITE_TOKEN or SANITY_API_WRITE_TOKEN.");
  console.error("Create one at https://sanity.io/manage → Project ewciugup → API → Tokens (Editor permissions).");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "ewciugup",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2024-01-01",
  token,
  useCdn: false,
});

type ServiceContentEntry = {
  slug: string;
  lang: string;
  metaTitle: string;
  metaDescription: string;
  heroH1: string;
  heroH2: string;
  description: string;
  longDescription: string;
  features: string[];
};

type ProjectContentEntry = {
  slug: string;
  lang: string;
  featuredHomepage: boolean;
  metaTitle: string;
  metaDescription: string;
  heroH1: string;
  heroH2: string;
  pitch: string;
  cardTeaser: string;
  challenge: string;
  solution: string;
  outcome: string;
  serviceSlugs: string[];
  family: string;
  secondaryFamily?: string;
};

const serviceContent = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/v18-service-content.json"), "utf8"),
) as Record<string, ServiceContentEntry>;

const projectContent = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/v18-project-content.json"), "utf8"),
) as Record<string, ProjectContentEntry>;

const stats = {
  servicesUpdated: 0,
  servicesCreated: 0,
  servicesDeleted: 0,
  projectsUpdated: 0,
  projectsCreated: 0,
  faqsTagged: 0,
  aboutUpdated: 0,
  methodPagesUpdated: 0,
  securityPagesUpdated: 0,
};

async function main() {
  console.log("=== MAWT v18 content population ===\n");

  await cleanupLegacyServices();
  await ensureV18Services();
  await populateServiceContent();
  const serviceIdByKey = await getServiceIdMap();
  await populateProjects(serviceIdByKey);
  await tagFaqs();
  await populateAboutContent();
  await populateStandalonePages();

  console.log("\n=== Summary ===");
  console.log(JSON.stringify(stats, null, 2));

  const featured = await client.fetch<number>(
    `count(*[_type == "project" && featuredHomepage == true && language in ["fr","en"]])`,
  );
  const taggedFaqs = await client.fetch<number>(
    `count(*[_type == "faq" && count(tags) > 0])`,
  );
  const serviceCount = await client.fetch<number>(
    `count(*[_type == "service" && language in ["fr","en"]])`,
  );
  const projectCount = await client.fetch<number>(
    `count(*[_type == "project" && language in ["fr","en"]])`,
  );
  const methodPageCount = await client.fetch<number>(
    `count(*[_type == "methodPage" && language in ["fr","en"]])`,
  );
  const securityPageCount = await client.fetch<number>(
    `count(*[_type == "securityPage" && language in ["fr","en"]])`,
  );

  console.log("\nValidation:");
  console.log(`- Services (FR+EN): ${serviceCount} (expected 70)`);
  console.log(`- Projects (FR+EN): ${projectCount} (expected 24)`);
  console.log(`- featuredHomepage=true: ${featured} (expected 6 = 3 projects × 2 langs)`);
  console.log(`- FAQs tagged: ${taggedFaqs} (expected 20)`);
  console.log(`- Method pages: ${methodPageCount} (expected 2: notre-methode + our-process)`);
  console.log(`- Security pages: ${securityPageCount} (expected 2: securite + security)`);
}

async function cleanupLegacyServices() {
  const existing = await client.fetch<{ _id: string; slug: { current: string }; title: string }[]>(
    `*[_type == "service"]{_id, slug, title}`,
  );

  for (const svc of existing) {
    const slug = svc.slug?.current;
    if (!slug) continue;

    if (DELETE_SERVICE_SLUGS.includes(slug)) {
      await deleteWithRefs(svc._id);
      stats.servicesDeleted++;
      console.log(`🗑️  Deleted legacy service: ${slug}`);
      continue;
    }

    const rename = RENAME_SERVICE_SLUGS[slug];
    if (rename) {
      await client
        .patch(svc._id)
        .set({
          "slug.current": rename.newSlug,
          ...(rename.title ? { title: rename.title } : {}),
          family: rename.family,
          language: "fr",
        })
        .commit();
      console.log(`✏️  Renamed service: ${slug} → ${rename.newSlug}`);
    }
  }
}

async function deleteWithRefs(id: string) {
  const refs = await client.fetch<{ _id: string }[]>(`*[references($id)]{_id}`, { id });
  for (const ref of refs) {
    await client.patch(ref._id).unset([`services[_ref == "${id}"]`]).commit();
  }
  await client.delete(id);
}

async function ensureV18Services() {
  for (const def of V18_SERVICES) {
    for (const lang of ["fr", "en"] as const) {
      const slug = lang === "fr" ? def.frSlug : def.enSlug;
      const title = lang === "fr" ? def.frTitle : def.enTitle;
      const existing = await client.fetch<{ _id: string } | null>(
        `*[_type == "service" && slug.current == $slug && language == $lang][0]{_id}`,
        { slug, lang },
      );

      const baseDoc = {
        _type: "service" as const,
        language: lang,
        title,
        slug: { _type: "slug" as const, current: slug },
        family: def.family,
        tier: def.tier,
        displayAsCard: def.displayAsCard ?? true,
        h2SeoCapture: def.h2SeoCapture?.[lang],
      };

      if (existing) {
        await client.patch(existing._id).set(baseDoc).commit();
      } else {
        await client.create(baseDoc);
        stats.servicesCreated++;
        console.log(`✅ Created service: ${lang}:${slug}`);
      }
    }
  }
}

async function populateServiceContent() {
  for (const [key, content] of Object.entries(serviceContent)) {
    const doc = await client.fetch<{ _id: string; title: string } | null>(
      `*[_type == "service" && slug.current == $slug && language == $lang][0]{_id, title}`,
      { slug: content.slug, lang: content.lang },
    );
    if (!doc) {
      console.warn(`⚠️  Missing service doc for ${key}`);
      continue;
    }

    await client
      .patch(doc._id)
      .set({
        description: content.description,
        heroH1: content.heroH1,
        heroH2: content.heroH2,
        longDescription: textToBlocks(content.longDescription),
        features: content.features,
        seo: {
          metaTitle: content.metaTitle,
          metaDescription: content.metaDescription,
        },
      })
      .commit();

    stats.servicesUpdated++;
  }
  console.log(`✅ Populated content for ${stats.servicesUpdated} service language docs`);
}

async function getServiceIdMap() {
  const rows = await client.fetch<{ _id: string; slug: string; language: string }[]>(
    `*[_type == "service" && language in ["fr","en"]]{_id, "slug": slug.current, language}`,
  );
  const map = new Map<string, string>();
  for (const row of rows) {
    map.set(`${row.language}:${row.slug}`, row._id);
  }
  return map;
}

async function populateProjects(serviceIdByKey: Map<string, string>) {
  for (const [key, content] of Object.entries(projectContent)) {
    const titleFromHero = content.heroH1.split(":")[0]?.trim() || content.slug;
    const serviceRefs = content.serviceSlugs
      .map((slug) => serviceIdByKey.get(`${content.lang}:${slug}`))
      .filter(Boolean)
      .map((_ref) => ({ _type: "reference" as const, _ref: _ref! }));

    const doc = {
      _type: "project" as const,
      language: content.lang,
      title: titleFromHero,
      slug: { _type: "slug" as const, current: content.slug },
      heroH1: content.heroH1,
      heroH2: content.heroH2,
      pitch: content.pitch || undefined,
      cardTeaser: content.cardTeaser,
      challenge: content.challenge || undefined,
      solution: content.solution,
      outcome: content.outcome,
      featuredHomepage: content.featuredHomepage,
      family: content.family || undefined,
      secondaryFamily: content.secondaryFamily,
      services: serviceRefs,
      seo: {
        metaTitle: content.metaTitle,
        metaDescription: content.metaDescription,
      },
    };

    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "project" && slug.current == $slug && language == $lang][0]{_id}`,
      { slug: content.slug, lang: content.lang },
    );

    if (existing) {
      await client.patch(existing._id).set(doc).commit();
      stats.projectsUpdated++;
    } else {
      await client.create(doc);
      stats.projectsCreated++;
      console.log(`✅ Created project: ${key}`);
    }
  }
}

async function tagFaqs() {
  for (const [id, tags] of Object.entries(FAQ_TAG_MAP)) {
    await client.patch(id).set({ tags, language: "en" }).commit();
    stats.faqsTagged++;
  }
  console.log(`✅ Tagged ${stats.faqsTagged} FAQs`);
}

async function populateAboutContent() {
  for (const lang of ["fr", "en"] as const) {
    const copy = ABOUT_COPY[lang];
    const doc = {
      _type: "aboutContent" as const,
      language: lang,
      heroH1: copy.hero.h1,
      heroH2: copy.hero.h2,
      storyH2: copy.story.h2,
      storyP1: copy.story.p1,
      storyP2: copy.story.p2,
      storyP3: copy.story.p3,
      teamH2: copy.team.h2,
      teamBody: copy.team.body,
      principles: copy.howWeWork.principles,
      trackRecordH2: copy.trackRecord.h2,
      trackRecordBody: copy.trackRecord.body,
      bottomCtaH2: copy.bottomCta.h2,
      bottomCtaBody: copy.bottomCta.body,
      heading: copy.hero.h1,
      subheading: copy.hero.h2,
      seo: {
        metaTitle: copy.seo.title,
        metaDescription: copy.seo.description,
      },
    };

    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "aboutContent" && language == $lang][0]{_id}`,
      { lang },
    );

    if (existing) {
      await client.patch(existing._id).set(doc).commit();
    } else {
      await client.create(doc);
    }
    stats.aboutUpdated++;
  }
  console.log(`✅ Populated ${stats.aboutUpdated} aboutContent docs`);
}

async function populateStandalonePages() {
  for (const lang of ["fr", "en"] as const) {
    const methodCopy = STANDALONE_PAGES.method[lang];
    const methodDoc = {
      _type: "methodPage" as const,
      language: lang,
      slug: { _type: "slug" as const, current: methodCopy.slug },
      heroH1: methodCopy.heroH1,
      heroH2: methodCopy.heroH2,
      intro: textToBlocks(methodCopy.intro),
      steps: methodCopy.steps.map((step) => stepSection(step.title, step.body)),
      differentiators: textToBlocks(methodCopy.differentiators),
      bottomCtaH2: methodCopy.bottomCtaH2,
      bottomCtaBody: methodCopy.bottomCtaBody,
      bottomCtaLabel: methodCopy.bottomCtaLabel,
      seo: {
        metaTitle: methodCopy.metaTitle,
        metaDescription: methodCopy.metaDescription,
      },
    };

    const existingMethod = await client.fetch<{ _id: string } | null>(
      `*[_type == "methodPage" && slug.current == $slug && language == $lang][0]{_id}`,
      { slug: methodCopy.slug, lang },
    );

    if (existingMethod) {
      await client.patch(existingMethod._id).set(methodDoc).commit();
    } else {
      await client.create(methodDoc);
    }
    stats.methodPagesUpdated++;
    console.log(`✅ Method page: ${lang}:${methodCopy.slug}`);

    const securityCopy = STANDALONE_PAGES.security[lang];
    const securityDoc = {
      _type: "securityPage" as const,
      language: lang,
      slug: { _type: "slug" as const, current: securityCopy.slug },
      heroH1: securityCopy.heroH1,
      heroH2: securityCopy.heroH2,
      intro: textToBlocks(securityCopy.intro),
      sections: securityCopy.sections.map((section) => stepSection(section.title, section.body)),
      bottomCtaH2: securityCopy.bottomCtaH2,
      bottomCtaBody: securityCopy.bottomCtaBody,
      bottomCtaLabel: securityCopy.bottomCtaLabel,
      seo: {
        metaTitle: securityCopy.metaTitle,
        metaDescription: securityCopy.metaDescription,
      },
    };

    const existingSecurity = await client.fetch<{ _id: string } | null>(
      `*[_type == "securityPage" && slug.current == $slug && language == $lang][0]{_id}`,
      { slug: securityCopy.slug, lang },
    );

    if (existingSecurity) {
      await client.patch(existingSecurity._id).set(securityDoc).commit();
    } else {
      await client.create(securityDoc);
    }
    stats.securityPagesUpdated++;
    console.log(`✅ Security page: ${lang}:${securityCopy.slug}`);
  }
}

main().catch((error) => {
  console.error("Population failed:", error);
  process.exit(1);
});
