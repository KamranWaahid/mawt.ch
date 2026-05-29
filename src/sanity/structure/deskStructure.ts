import type { StructureResolver } from "sanity/structure";
import { 
  Users, 
  Mail, 
  Briefcase, 
  Settings, 
  FileText, 
  Layers,
  HelpCircle,
  MessageSquare,
  RefreshCw,
  UserCircle,
  Phone,
  Network
} from "lucide-react";

import { DashboardView } from "../components/DashboardView";
import { Book } from "lucide-react";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Command Center")
    .items([
      // Dashboard
      S.listItem()
        .title("Dashboard")
        .icon(RefreshCw)
        .child(
          S.component(DashboardView)
            .title("Dashboard")
            .id("dashboard")
        ),

      S.divider(),

      // System & Global
      S.listItem()
        .title("System Dictionaries")
        .icon(Book)
        .child(S.documentTypeList("dictionary").title("UI Labels")),
      
      S.listItem()
        .title("Inbound Management")
        .icon(Mail)
        .child(
          S.list()
            .title("Inbound")
            .items([
              S.listItem()
                .title("Contact Leads")
                .icon(MessageSquare)
                .child(S.documentTypeList("contactLead").title("Contact Leads")),
              S.listItem()
                .title("Newsletter Subscribers")
                .icon(Users)
                .child(S.documentTypeList("newsletterSubscriber").title("Subscribers")),
            ])
        ),

      S.divider(),

      // Core Content
      S.listItem()
        .title("Project Portfolio")
        .icon(Briefcase)
        .child(S.documentTypeList("project").title("Projects")),
      
      S.listItem()
        .title("Services")
        .icon(Layers)
        .child(S.documentTypeList("service").title("Services")),

      S.listItem()
        .title("Documentation")
        .icon(FileText)
        .child(S.documentTypeList("doc").title("Documentation")),

      S.listItem()
        .title("Insights (Blog)")
        .icon(MessageSquare)
        .child(S.documentTypeList("post").title("Blog Posts")),

      S.listItem()
        .title("Authors")
        .icon(UserCircle)
        .child(S.documentTypeList("author").title("Authors")),

      S.listItem()
        .title("Help Center (FAQ)")
        .icon(HelpCircle)
        .child(S.documentTypeList("faq").title("FAQs")),

      S.divider(),

      // Site Settings & Global Config
      S.listItem()
        .title("Global Settings")
        .icon(Settings)
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
      
      S.listItem()
        .title("About Content")
        .icon(FileText)
        .child(
          S.editor()
            .id("aboutContent")
            .schemaType("aboutContent")
            .documentId("aboutContent")
        ),

      S.divider(),

      S.listItem()
        .title("Global Contact")
        .icon(Phone)
        .child(
          S.editor()
            .id("contact")
            .schemaType("contact")
            .documentId("contact")
        ),

      S.listItem()
        .title("Network (Partners)")
        .icon(Network)
        .child(S.documentTypeList("partner").title("Partners")),

      S.listItem()
        .title("Static Pages (Legal & headers)")
        .icon(FileText)
        .child(S.documentTypeList("pageContent").title("Static Pages")),

      // Filter out types that are handled explicitly above
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "siteSettings",
            "aboutContent",
            "project",
            "service",
            "doc",
            "post",
            "faq",
            "contactLead",
            "newsletterSubscriber",
            "author",
            "dictionary",
            "partner",
            "pageContent",
          ].includes(listItem.getId()!)
      ),
    ]);
