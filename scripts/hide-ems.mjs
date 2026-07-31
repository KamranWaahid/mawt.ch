// Removes EMS from the live site content in Sanity:
//   1. Hides the EMS project (EN + FR) — same approach as hide-diagora.mjs.
//   2. Strips the trailing "Real case : EMS (…)" / "Cas concret : EMS (…)"
//      sentence from the qa-testing service longDescription (EN + FR).
//   3. Deletes the "EMS Medical System" partner logo document.
//
// Requires a write token: set SANITY_API_WRITE_TOKEN in .env (or env var).
// Run with: node scripts/hide-ems.mjs

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";

const env = { ...process.env };
for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const i = line.indexOf("=");
    if (i === -1 || line.trim().startsWith("#")) continue;
    const key = line.slice(0, i).trim();
    if (!(key in env)) env[key] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
}

const token = env.SANITY_API_WRITE_TOKEN || env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN. Add it to .env, then re-run.");
  process.exit(1);
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || env.SANITY_DATASET || "production",
  token,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
});

// 1. Hide the EMS project documents (en, fr).
const projectIds = ["MScPNk9ueXiUZ6ZHryNLDI", "r8QPoU0XLRPq9k38bIM5DY"];
for (const id of projectIds) {
  const r = await client.patch(id).set({ hidden: true }).commit();
  console.log("hidden=true set on project", r._id, "(", r.title, "/", r.language, ")");
}

// 2. Remove the EMS case-study sentence from the qa-testing service copy.
const markers = ["Real case :", "Cas concret :"];
const serviceIds = ["h6RIlqYooS2c3gLVCyQpP4", "r8QPoU0XLRPq9k38bHn3UX"];
for (const id of serviceIds) {
  const doc = await client.getDocument(id);
  let changed = false;

  const longDescription = (doc.longDescription ?? []).map((block) => {
    if (!Array.isArray(block.children)) return block;
    const cutIndex = block.children.findIndex((span) =>
      markers.some((m) => typeof span.text === "string" && span.text.includes(m))
    );
    if (cutIndex === -1) return block;

    changed = true;
    const cutSpan = block.children[cutIndex];
    const marker = markers.find((m) => cutSpan.text.includes(m));
    const keptText = cutSpan.text.slice(0, cutSpan.text.indexOf(marker)).trimEnd();

    // Keep spans before the marker; keep the truncated span only if text remains.
    const children = block.children.slice(0, cutIndex);
    if (keptText) children.push({ ...cutSpan, text: keptText });
    return { ...block, children, markDefs: [] };
  });

  if (!changed) {
    console.log("no EMS sentence found in service", id, "- skipped");
    continue;
  }
  const r = await client.patch(id).set({ longDescription }).commit();
  console.log("EMS sentence removed from service", r._id, "(", r.language, ")");
}

// 3. Delete the EMS partner logo document (if it still exists).
const partnerId = "d378c533-10c0-42f2-81ec-59739d04abd2";
try {
  const existing = await client.getDocument(partnerId);
  if (existing) {
    await client.delete(partnerId);
    console.log("deleted partner", partnerId, "(", existing.name, ")");
  } else {
    console.log("partner", partnerId, "already gone");
  }
} catch (err) {
  if (String(err?.message || err).includes("not found") || err?.statusCode === 404) {
    console.log("partner", partnerId, "already gone");
  } else {
    throw err;
  }
}
