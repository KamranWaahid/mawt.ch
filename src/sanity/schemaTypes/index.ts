import { aboutContentType } from "@/sanity/schemaTypes/about-content";
import { projectType } from "@/sanity/schemaTypes/project";
import { serviceType } from "@/sanity/schemaTypes/service";
import { siteSettingsType } from "@/sanity/schemaTypes/site-settings";
import { testimonialType } from "@/sanity/schemaTypes/testimonial";
import { careerType } from "@/sanity/schemaTypes/career";
import { faqType } from "@/sanity/schemaTypes/faq";
import { pricingType } from "@/sanity/schemaTypes/pricing";
import { docType } from "@/sanity/schemaTypes/doc";
import { contactLead } from "@/sanity/schemaTypes/contact-lead";
import { newsletterSubscriber } from "@/sanity/schemaTypes/newsletter-subscriber";
import { comparisonTableType } from "@/sanity/schemaTypes/objects/comparison-table";
import { dictionaryType } from "@/sanity/schemaTypes/dictionary";
import { authorType } from "@/sanity/schemaTypes/author";
import { seoObject } from "@/sanity/schemaTypes/objects/seo";
import { postType } from "@/sanity/schemaTypes/postType";

import { contactType } from "@/sanity/schemaTypes/contact";
import { partnerType } from "@/sanity/schemaTypes/partner";

export const schemaTypes = [
  siteSettingsType,
  projectType,
  testimonialType,
  serviceType,
  aboutContentType,
  careerType,
  faqType,
  pricingType,
  docType,
  postType,
  contactType,
  partnerType,
  contactLead,
  newsletterSubscriber,
  comparisonTableType,
  dictionaryType,
  authorType,
  seoObject,
];
