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
  "about": *[_type == "aboutContent"][0]{
    heading,
    subheading,
    story,
    values,
    locations
  },
  "projects": *[_type == "project"] | order(year desc){
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
  "services": *[_type == "service"] | order(_createdAt asc){
    _id,
    title,
    category,
    description
  },
  "testimonials": *[_type == "testimonial"] | order(_createdAt desc){
    _id,
    quote,
    name,
    role
  },
  "posts": *[_type == "post"] | order(publishedAt desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    author->{
      name,
      role,
      avatar
    },
    mainImage,
    categories,
    publishedAt,
    excerpt
  }
}
`;

const projectBySlugQuery = groq`
*[_type == "project" && slug.current == $slug][0]{
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
*[_type == "faq"] | order(order asc, _createdAt asc){
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

export async function getHomePageData(): Promise<HomePageData> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return mockHomeData;
  const data = await sanityClient.fetch<HomePageData>(homeQuery, {}, {
    next: { tags: ["home", "project", "service", "testimonial"] }
  });
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
*[_type == "project"] | order(year desc){
  _id,
  title,
  "slug": slug.current,
  workType,
  industry,
  year
}
`;

export async function getAllProjects(): Promise<Partial<Project>[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  return sanityClient.fetch(allProjectsQuery, {}, {
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

export async function getFAQs(): Promise<FAQ[]> {
  const sanityClient = getSanityClient();
  const defaultFaqs: FAQ[] = [
    { _id: "faq-1", question: "Do you only build websites?", answer: "No. MAWT works on broader digital systems including automation, integrations, branding, and operational platforms.", category: "General" },
    { _id: "faq-2", question: "Do you work with small businesses?", answer: "Yes. We work with startups, small businesses, and growing companies as well as larger organizations.", category: "General" },
    { _id: "faq-3", question: "Do you offer ongoing support?", answer: "Yes. We provide maintenance, optimization, and long-term technical support.", category: "Support" },
    { _id: "faq-4", question: "Can you modernize existing systems?", answer: "Absolutely. Many of our projects involve redesigning or improving existing platforms and workflows.", category: "Services" },
    { _id: "faq-5", question: "Do you provide custom solutions?", answer: "Yes. Every solution is tailored to the specific business and operational needs of the client.", category: "Services" }
  ];

  if (!sanityClient) return defaultFaqs;
  const data = await sanityClient.fetch<FAQ[]>(faqsQuery);
  return data?.length ? data : defaultFaqs;
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
  *[_type == "project" && slug.current != $currentSlug && count(tags[@ in $tags]) > 0] | order(year desc)[0...3]{
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
*[_type == "service" && slug.current == $slug && language == $lang][0]{
  _id,
  language,
  title,
  "slug": slug.current,
  family,
  heroH1,
  heroH2,
  h2SeoCapture,
  description,
  icon,
  answerBox,
  whoFor,
  longDescription,
  features,
  deliverables,
  keyTakeaways,
  sections[]{
    h2,
    paragraphs,
    bullets
  },
  comparisonTable{
    title,
    columns,
    rows[]{ cells }
  },
  faq[]{
    question,
    answer
  },
  cta,
  "relatedServices": relatedServices[]->{
    _id,
    title,
    "slug": slug.current,
    heroH2,
    description,
    icon
  },
  "featuredProjects": featuredProjects[]->{
    _id,
    title,
    "slug": slug.current,
    coverImage,
    tags,
    year
  },
  seo
}
`;

export async function getServiceBySlug(slug: string, lang: string): Promise<Service | null> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return null;
  return sanityClient.fetch<Service | null>(serviceBySlugQuery, { slug, lang }, {
    next: { tags: ["service", `service:${lang}:${slug}`] },
  });
}

// Blog / Insights Queries
export const allPostsQuery = groq`
*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  author->{
    name,
    role,
    avatar
  },
  mainImage,
  categories,
  publishedAt,
  excerpt
}
`;

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0]{
  _id,
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
  categories,
  publishedAt,
  body,
  seo
}
`;

export async function getPosts(): Promise<BlogPost[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  return sanityClient.fetch(allPostsQuery);
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return {} as BlogPost;
  return sanityClient.fetch(postBySlugQuery, { slug });
}

const partnersQuery = groq`
*[_type == "partner"] | order(order asc){
  _id,
  name,
  logo,
  url,
  category,
  featured
}
`;

export async function getPartners(): Promise<Partner[]> {
  const sanityClient = getSanityClient();
  if (!sanityClient) return [];
  return sanityClient.fetch<Partner[]>(partnersQuery, {}, {
    next: { tags: ["partners"] }
  });
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
  const defaultContact: ContactSettings = {
    _id: "default-contact",
    headline: "Get in touch with us with any question!",
    email: "info@mawt.ch",
    phone: "+41 76 636 33 33",
    offices: [
      {
        city: "Carouge",
        address: "Rue de la fontenette 23\n1227 Carouge",
        isMain: true
      }
    ],
    socialHeadline: "Social"
  };

  if (!sanityClient) return defaultContact;
  const data = await sanityClient.fetch<ContactSettings>(contactQuery, {}, {
    next: { tags: ["contact"] }
  });
  return data || defaultContact;
}



