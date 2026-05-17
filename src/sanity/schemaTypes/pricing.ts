import { defineField, defineType } from "sanity";

export const pricingType = defineType({
  name: "pricingPlan",
  title: "Pricing Plan",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Plan Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      placeholder: "e.g. CHF 49",
    }),
    defineField({
      name: "interval",
      title: "Billing Interval",
      type: "string",
      options: {
        list: [
          { title: "Monthly", value: "month" },
          { title: "Yearly", value: "year" },
          { title: "Custom", value: "custom" },
        ],
      },
      initialValue: "month",
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "string",
      initialValue: "Get Started",
    }),
    defineField({
      name: "recommended",
      title: "Recommended",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
});
