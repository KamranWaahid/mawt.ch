import { groq } from "next-sanity";

import { getSanityClient } from "@/lib/sanity.client";
import { mockHomeData, mockProjectBySlug } from "@/lib/sanity.mock";
import type { HomePageData, Project, Career, FAQ, PricingPlan, Doc, Service, BlogPost, Partner, ContactSettings } from "@/lib/types";

const homeQuery = groq`
{
  "settings": *[_type == "siteSettings"][0]{
    title,
    tagline,
    ctaLabel,
    ctaHref,
    seoDescription,
    socialLinks,
    servicesNav,
    mainNav
  },
  "about": *[_type == "aboutContent" && language == $lang][0]{
    heading,
    subheading,
    story,
    values,
    locations
  },
  "projects": *[_type == "project" && language == $lang && !(hidden == true)] | order(year desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    overview,
    workType,
    industry,
    year,
    tags,
    coverImage,
    gallery,
    testimonialQuote,
    testimonialAuthor
  }[0...6],
  "services": *[_type == "service" && language == $lang] | order(tier asc){
    _id,
    title,
    "slug": slug.current,
    family,
    displayAsCard,
    tier,
    icon,
    description
  },
  "testimonials": *[_type == "testimonial"] | order(_createdAt desc){
    _id,
    quote,
    name,
    role
  },
  "posts": *[_type == "post" && language == $lang] | order(publishedAt desc)[0...3]{
    _id,
    language,
    title,
    "slug": slug.current,
    author->{
      name,
      role,
      avatar
    },
    mainImage,
    "categories": coalesce(categories, select(defined(category) => [category], [])),
    publishedAt,
    excerpt,
    body
  }
}
`;

// !(hidden == true): unfinished/hidden projects must not exist ANYWHERE on
// the site — the listing already filters them, and without this guard the
// detail URL kept rendering 200 (reachable, indexable) for hidden projects.
const projectBySlugQuery = groq`
*[_type == "project" && slug.current == $slug && !(hidden == true)][0]{
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  excerpt,
  overview,
  workType,
  industry,
  year,
  tags,
  coverImage,
  gallery,
  testimonialQuote,
  testimonialAuthor,
  "services": services[]->{
    _id,
    title,
    category,
    description
  },
  phases,
  problemStatement,
  problemImage,
  solution,
  solutionImage,
  deliverables,
  videoUrl,
  technologies
}
`;

const careersQuery = groq`
*[_type == "career"] | order(publishedAt desc){
  _id,
  title,
  location,
  type,
  description
}
`;

const faqsQuery = groq`
*[_type == "faq" && language == $lang] | order(order asc, _createdAt asc){
  _id,
  question,
  answer,
  category
}
`;

const pricingQuery = groq`
*[_type == "pricingPlan"] | order(order asc){
  _id,
  name,
  price,
  interval,
  description,
  features,
  cta,
  recommended
}
`;

const docsQuery = groq`
*[_type == "doc"] | order(order asc, _createdAt asc){
  _id,
  title,
  "slug": slug.current,
  group,
  excerpt,
  content
}
`;

const docBySlugQuery = groq`
*[_type == "doc" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  group,
  excerpt,
  content,
  category,
  featured,
  estimatedReadTime,
  "relatedDocs": relatedDocs[]->{
    _id,
    title,
    "slug": slug.current,
    excerpt
  }
}
`;

export async function getHomePageData(lang: string = "en"): Promise<HomePageData> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return mockHomeData;
  let data: HomePageData;

  try {
    data = await sanityClient.fetch<HomePageData>(homeQuery, { lang }, {
      next: { tags: ["home", "project", "service", "testimonial"] }
    });
  } catch (error) {
    console.warn("Failed to fetch Sanity homepage data, falling back to local data:", error);
    return mockHomeData;
  }

  return {
    ...mockHomeData,
    ...data,
    settings: data.settings ?? mockHomeData.settings,
    about: data.about ?? mockHomeData.about,
    projects: data.projects?.length ? data.projects : mockHomeData.projects,
    services: data.services?.length ? data.services : mockHomeData.services,
    testimonials: data.testimonials?.length ? data.testimonials : mockHomeData.testimonials,
    posts: data.posts?.length ? data.posts : undefined,
  };
}

export const allProjectsQuery = groq`
*[_type == "project" && language == $lang && !(hidden == true)] | order(year desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  workType,
  industry,
  year,
  coverImage
}
`;

export async function getAllProjects(lang: string): Promise<Partial<Project>[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  return sanityClient.fetch(allProjectsQuery, { lang }, {
    next: { tags: ["project"] }
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return mockProjectBySlug(slug);
  return sanityClient.fetch<Project | null>(projectBySlugQuery, { slug }, {
    next: { tags: ["project", `project:${slug}`] }
  });
}

export async function getCareers(): Promise<Career[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  return sanityClient.fetch<Career[]>(careersQuery);
}

export async function getFAQs(lang: string = "en"): Promise<FAQ[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  // Language-scoped: never fall back to another language's FAQs (that surfaced
  // English content on the French page). Empty → the page shows its own
  // localized "no FAQs / coming soon" placeholder.
  const data = await sanityClient.fetch<FAQ[]>(faqsQuery, { lang }, {
    next: { tags: ["faq", `faq:${lang}`] },
  });
  return data ?? [];
}

// ── CMS-driven standalone pages (about / security / method) ──────────────────
const aboutContentPageQuery = groq`
*[_type == "aboutContent" && language == $lang][0]{
  heroH1, heroH2,
  storyH2, storyP1, storyP2, storyP3,
  teamH2, teamBody,
  principles[]{ emoji, title, description },
  trackRecordH2, trackRecordBody,
  bottomCtaH2, bottomCtaBody,
  locations[]{ city, description },
  seo
}`;

const securityPageQuery = groq`
*[_type == "securityPage" && language == $lang][0]{
  heroH1, heroH2, intro,
  sections[]{ title, body },
  bottomCtaH2, bottomCtaBody, bottomCtaLabel,
  seo
}`;

const methodPageQuery = groq`
*[_type == "methodPage" && language == $lang][0]{
  heroH1, heroH2, intro,
  steps[]{ title, body },
  differentiators,
  bottomCtaH2, bottomCtaBody, bottomCtaLabel,
  seo
}`;

export async function getAboutContent(lang: string): Promise<any | null> {
  const c = getSanityClient();
  if (!c) return null;
  return c.fetch(aboutContentPageQuery, { lang }, { next: { tags: ["aboutContent", `aboutContent:${lang}`] } });
}

export async function getSecurityPage(lang: string): Promise<any | null> {
  const c = getSanityClient();
  if (!c) return null;
  return c.fetch(securityPageQuery, { lang }, { next: { tags: ["securityPage", `securityPage:${lang}`] } });
}

export async function getMethodPage(lang: string): Promise<any | null> {
  const c = getSanityClient();
  if (!c) return null;
  return c.fetch(methodPageQuery, { lang }, { next: { tags: ["methodPage", `methodPage:${lang}`] } });
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  return sanityClient.fetch<PricingPlan[]>(pricingQuery);
}

export async function getDocs(): Promise<Doc[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  return sanityClient.fetch<Doc[]>(docsQuery, {}, {
    next: { tags: ["docs"] }
  });
}

export async function getDocBySlug(slug: string): Promise<Doc | null> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return null;
  return sanityClient.fetch<Doc | null>(docBySlugQuery, { slug }, {
    next: { tags: ["docs", `doc:${slug}`] }
  });
}

const dictionaryQuery = groq`
  *[_type == "dictionary" && language == $lang]{
    namespace,
    labels
  }
`;

export async function getDictionaryFromSanity(lang: string) {
  const sanityClient = getSanityClient();
  if (!sanityClient) return {};
  
  const data = await sanityClient.fetch<{ namespace: string, labels: { key: string, value: string }[] }[]>(
    dictionaryQuery, 
    { lang },
    { next: { tags: ["dictionary", `dictionary:${lang}`] } }
  );

  const merged: Record<string, any> = {};
  data.forEach((item) => {
    const labels: Record<string, string> = {};
    item.labels?.forEach((l) => {
      labels[l.key] = l.value;
    });
    merged[item.namespace] = labels;
  });

  return merged;
}

// Relational Discovery Queries
export const relatedProjectsQuery = groq`
  *[_type == "project" && slug.current != $currentSlug && !(hidden == true) && count(tags[@ in $tags]) > 0] | order(year desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    tags
  }
`;

export const relatedDocsByTagsQuery = groq`
  *[_type == "doc" && slug.current != $currentSlug && count(tags[@ in $tags]) > 0] | order(_createdAt desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    category
  }
`;

export async function getRelatedProjects(currentSlug: string, tags: string[]): Promise<Partial<Project>[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  return sanityClient.fetch(relatedProjectsQuery, { currentSlug, tags });
}

export async function getRelatedDocsByTags(currentSlug: string, tags: string[]): Promise<Partial<Doc>[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  return sanityClient.fetch(relatedDocsByTagsQuery, { currentSlug, tags });
}

export const serviceBySlugQuery = groq`
*[_type == "service" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  icon,
  longDescription,
  features,
  "featuredProjects": featuredProjects[]->{
    _id,
    title,
    "slug": slug.current,
    coverImage,
    tags,
    year,
    hidden
  }[!(hidden == true)],
  seo
}
`;

export async function getServiceBySlug(slug: string): Promise<Service> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return {} as Service;
  return sanityClient.fetch(serviceBySlugQuery, { slug });
}

// Blog / Insights Queries
export const allPostsQuery = groq`
*[_type == "post" && language == $lang] | order(publishedAt desc){
  _id,
  language,
  title,
  "slug": slug.current,
  author->{
    name,
    role,
    avatar
  },
  mainImage,
  "categories": coalesce(categories, select(defined(category) => [category], [])),
  publishedAt,
  excerpt,
  body
}
`;

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug && language == $lang][0]{
  _id,
  language,
  title,
  "slug": slug.current,
  author->{
    name,
    role,
    avatar,
    bio,
    socialLinks
  },
  mainImage,
  "categories": coalesce(categories, select(defined(category) => [category], [])),
  publishedAt,
  excerpt,
  body,
  seo,
  // Translated twin, resolved in BOTH directions (either side may hold the
  // translationOf reference). null for genuinely monolingual posts — which
  // then emit no hreflang at all (correct: no signal beats a false signal).
  "translation": coalesce(
    translationOf->{ "slug": slug.current, language },
    *[_type == "post" && translationOf._ref == ^._id][0]{ "slug": slug.current, language }
  )
}
`;

export async function getPosts(lang: string = "en"): Promise<BlogPost[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  return sanityClient.fetch(allPostsQuery, { lang });
}

export async function getPostBySlug(slug: string, lang: string = "en"): Promise<BlogPost | null> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return null;
  return sanityClient.fetch<BlogPost | null>(postBySlugQuery, { slug, lang });
}

const partnersQuery = groq`
*[_type == "partner"] | order(order asc){
  _id,
  name,
  logo{
    ...,
    "asset": {
      "_ref": asset._ref,
      "_type": asset._type,
      "url": asset->url,
      "mimeType": asset->mimeType,
      "metadata": asset->metadata{
        dimensions
      }
    }
  },
  url,
  category,
  featured
}
`;

export async function getPartners(): Promise<Partner[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  try {
    return await sanityClient.fetch<Partner[]>(partnersQuery, {}, {
      next: { tags: ["partners"] }
    });
  } catch (error) {
    console.warn("Failed to fetch Sanity partners, falling back to local logo wall:", error);
    return [];
  }
}

// Static pages (legal + list-page headers) stored as `pageContent`
export interface PageContentData {
  heroH1?: string;
  heroH2?: string;
  intro?: unknown[];
  body?: unknown[];
  bottomCtaH2?: string;
  bottomCtaBody?: string;
  bottomCtaLabel?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
}

const pageContentQuery = groq`
*[_type == "pageContent" && pageKey == $pageKey && language == $lang][0]{
  heroH1,
  heroH2,
  intro,
  body,
  bottomCtaH2,
  bottomCtaBody,
  bottomCtaLabel,
  seo
}
`;

export async function getPageContent(pageKey: string, lang: string): Promise<PageContentData | null> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return null;
  return sanityClient.fetch<PageContentData | null>(
    pageContentQuery,
    { pageKey, lang },
    { next: { tags: ["pageContent", `pageContent:${pageKey}:${lang}`] } },
  );
}

const contactQuery = groq`
*[_type == "contact"][0]{
  _id,
  headline,
  subheading,
  email,
  phone,
  offices,
  socialHeadline
}
`;

export async function getContactSettings(): Promise<ContactSettings> {
  const sanityClient = getSanityClient();
  // BUG-017: No hardcoded real contact details in source code.
  // Use environment variables for fallback values, or show a safe empty state.
  const defaultContact: ContactSettings = {
    _id: "default-contact",
    headline: process.env.CONTACT_FALLBACK_HEADLINE || "Get in touch with us!",
    email: process.env.CONTACT_FALLBACK_EMAIL || "",
    phone: process.env.CONTACT_FALLBACK_PHONE || "",
    offices: process.env.CONTACT_FALLBACK_CITY
      ? [
          {
            city: process.env.CONTACT_FALLBACK_CITY,
            address: process.env.CONTACT_FALLBACK_ADDRESS || "",
            isMain: true,
          },
        ]
      : [],
    socialHeadline: "Social",
  };

  if (!sanityClient) return defaultContact;
  const data = await sanityClient.fetch<ContactSettings>(contactQuery, {}, {
    next: { tags: ["contact"] }
  });
  
  const merged: ContactSettings = {
    ...defaultContact,
    ...data,
    email: process.env.CONTACT_FALLBACK_EMAIL || data?.email || defaultContact.email,
    phone: process.env.CONTACT_FALLBACK_PHONE || data?.phone || defaultContact.phone,
    headline: process.env.CONTACT_FALLBACK_HEADLINE || data?.headline || defaultContact.headline,
    offices: process.env.CONTACT_FALLBACK_CITY
      ? [
          {
            city: process.env.CONTACT_FALLBACK_CITY,
            address: process.env.CONTACT_FALLBACK_ADDRESS || "",
            isMain: true,
          },
        ]
      : (data?.offices || defaultContact.offices),
  };

  return merged;
}
