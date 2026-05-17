import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Site title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "text", rows: 3 }),
    defineField({ name: "ctaLabel", title: "Primary CTA label", type: "string" }),
    defineField({ name: "ctaHref", title: "Primary CTA href", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 4 }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "platform", type: "string", options: { list: ["LinkedIn", "Twitter", "GitHub", "Instagram"] } },
            { name: "url", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "mainNav",
      title: "Main Navigation Links",
      description: "Manage the top-level links shown in the navbar.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() },
            { name: "href", title: "URL / Path", type: "string", validation: (Rule) => Rule.required() },
            { name: "hasDropdown", title: "Has Dropdown?", type: "boolean", description: "If true, this link will trigger the services mega-menu." }
          ]
        }
      ]
    }),
    defineField({
      name: "servicesNav",
      title: "Services Navigation (Dropdown)",
      description: "Manage the categories and services shown in the navbar dropdown.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "category", title: "Category Name", type: "string", validation: (Rule) => Rule.required() },
            { name: "services", title: "Services", type: "array", of: [{ type: "string" }] },
          ],
        },
      ],
    }),
  ],
});
