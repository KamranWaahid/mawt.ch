import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);

const client = createClient({
  projectId: env.SANITY_PROJECT_ID || "ewciugup",
  dataset: env.SANITY_DATASET || "production",
  token: env.SANITY_WRITE_TOKEN,
  apiVersion: env.SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
});

const ids = ["MScPNk9ueXiUZ6ZHryC32y", "MScPNk9ueXiUZ6ZHryC4Si"]; // Diagora fr, en
for (const id of ids) {
  const r = await client.patch(id).set({ hidden: true }).commit();
  console.log("hidden=true set on", r._id, "(", r.title, "/", r.language, ")");
}
