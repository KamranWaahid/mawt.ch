import "server-only";
import { createClient } from "next-sanity";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();

/**
 * Authenticated READ client for private documents (contactLead,
 * newsletterSubscriber). The public CDN client must never be able to read
 * that PII — once the dataset ACL is locked down (audit checklist), only
 * token-bearing requests can. Prefers a dedicated Viewer token
 * (SANITY_API_READ_TOKEN) and falls back to the write token so admin stats
 * keep working until one is provisioned.
 */
export function getSanityPrivateReadClient() {
  const token =
    process.env.SANITY_API_READ_TOKEN?.trim() ||
    process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!projectId || !dataset || !token) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "published",
  });
}
