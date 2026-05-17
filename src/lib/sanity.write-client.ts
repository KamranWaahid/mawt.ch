import { createClient } from "next-sanity";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

export function getSanityWriteClient() {
  if (!projectId || !dataset || !token) {
    console.warn("Sanity write credentials missing. Mutations will be mocked.");
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false, // Must be false for mutations
  });
}
