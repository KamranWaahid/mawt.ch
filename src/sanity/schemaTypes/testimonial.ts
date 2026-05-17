import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "role", type: "string" }),
  ],
});
