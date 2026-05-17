import { defineType, defineField } from "sanity";

export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Unsubscribed", value: "unsubscribed" },
        ],
      },
      initialValue: "active",
    }),
  ],
  preview: {
    select: {
      title: "email",
      status: "status",
    },
    prepare({ title, status }) {
      const statusIcon = status === "active" ? "✅" : "❌";
      return {
        title: `${statusIcon} ${title}`,
        subtitle: status.toUpperCase(),
      };
    },
  },
});
