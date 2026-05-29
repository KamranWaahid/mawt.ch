/**
 * Publish 36 net-new service drafts + discard 5 duplicate/test drafts,
 * fixing the reference-integrity problem where published projects reference
 * services by their DRAFT id instead of the published id.
 *
 * Order per service avoids dangling strong references:
 *   1. create published doc from draft content (bare id)
 *   2. repoint every referencing doc: drafts.X -> X (or dup -> existing published)
 *   3. delete the draft
 *
 * Run: nvm use 20 && export $(grep -E '^(SANITY_WRITE_TOKEN|NEXT_PUBLIC_SANITY_)' .env.local | xargs) \
 *      && node --import tsx scripts/publish-services-cleanup.ts
 */
import { createClient } from "@sanity/client";

const token =
  process.env.SANITY_WRITE_TOKEN?.trim() || process.env.SANITY_API_WRITE_TOKEN?.trim();
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "ewciugup",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const TO_PUBLISH = [
  "drafts.02e826d7-ab24-4c96-b70c-6b1c153df472",
  "drafts.16e00d1d-fcd8-4a36-b1cb-9f1144620150",
  "drafts.170ac747-0f22-476a-9023-f513078e87da",
  "drafts.1bec1dac-ae42-498d-830b-1339fff8d090",
  "drafts.1bfdb9f2-4867-4c82-8a59-7e5f64c26b52",
  "drafts.25aa9e92-f5c5-43f5-a7d1-b97dc65ccc70",
  "drafts.3cbff3f1-d26e-4081-89b0-0aa794a6d393",
  "drafts.4d472da9-c0a1-4fea-ae9f-83dea9f72cac",
  "drafts.50aec602-fd87-44d1-8e70-8772860660e6",
  "drafts.56786e6f-d368-4d02-9610-d398f73219f9",
  "drafts.57c641ff-fb45-41b9-b528-fc5eda33ac33",
  "drafts.5901e884-6210-4fbd-bc81-0b12fb6d921e",
  "drafts.5f92c691-1e60-4654-aa37-40ca93a5c67d",
  "drafts.61903934-2bbf-44c8-af14-cec365b0f0b2",
  "drafts.6c2a6686-1b75-4abb-b29c-8727cc8a0e8c",
  "drafts.6d982ffb-5744-4a78-b515-994660be932b",
  "drafts.722c7f4d-55f2-483b-bec4-d3f35701130a",
  "drafts.7370ef25-6a45-4de6-9a12-a5ecbce3f125",
  "drafts.7a051487-9f34-4220-80e6-c73164817179",
  "drafts.7e986701-b58a-4a4d-8a96-1ec4f0aca5ea",
  "drafts.7ebb68e0-a9a3-4c7f-83c4-5a91af5fb196",
  "drafts.92f4bdd7-048e-4ef0-aa66-6c88e37f6631",
  "drafts.981df41c-a000-43ef-95e6-56050e633202",
  "drafts.9be91846-027c-4eb0-862c-1e8e7998cec2",
  "drafts.9d016204-16b3-4eab-ab09-7dd3d51f2550",
  "drafts.9d2a454f-a756-4463-8e3e-e8cbc1e691f4",
  "drafts.9ebb903d-65e4-4a9f-ae63-ab4d9557013f",
  "drafts.a024f1d0-314a-4dc1-921a-6dd8c158457a",
  "drafts.b37ab0e8-99c2-43da-ba62-5392abffc1a3",
  "drafts.c23723ec-c60c-4ac6-8335-1ed63462311c",
  "drafts.c4e5db40-b2d8-41aa-a15a-452df0674050",
  "drafts.cd819fb0-2782-45cc-bbf8-c155820dfccf",
  "drafts.e151274d-30e3-4a4d-9644-8480139ce94a",
  "drafts.e1b3be62-b3b8-4411-9c76-55fe081e480f",
  "drafts.ec2f4105-7b5b-4b22-af01-b97d17881783",
  "drafts.f16fa131-cec3-41db-b9f0-4a131bcde068",
];

const DUPS = [
  "drafts.386b54e8-98fa-4e93-ad2f-563b4ddd1e24", // e-commerce-eshop fr dup
  "drafts.724bebcd-4722-4d63-b0f9-efc7dfabbed5", // e-commerce-eshop fr dup
  "drafts.72dc49b3-205c-41cf-b5c1-f4040e77a61e", // audit-ux-seo-performance fr dup
  "drafts.abb86507-a830-4de8-b6e0-286b1d63512a", // test-v18-zzz fr
  "drafts.df01f8b3-5231-48c6-aaa8-ac85dbc1e84e", // branding-identite fr dup
];

type AnyDoc = Record<string, unknown>;

function deepReplaceRef(node: unknown, map: Record<string, string>): unknown {
  if (Array.isArray(node)) return node.map((n) => deepReplaceRef(n, map));
  if (node && typeof node === "object") {
    const obj = node as AnyDoc;
    if (typeof obj._ref === "string" && map[obj._ref]) {
      return { ...obj, _ref: map[obj._ref] };
    }
    const out: AnyDoc = {};
    for (const k of Object.keys(obj)) out[k] = deepReplaceRef(obj[k], map);
    return out;
  }
  return node;
}

async function run() {
  const refMap: Record<string, string> = {};

  // to-publish: draft id -> bare published id
  for (const id of TO_PUBLISH) refMap[id] = id.replace(/^drafts\./, "");

  // dups: draft id -> existing published doc with same slug + language
  for (const id of DUPS) {
    const draft = await client.getDocument(id);
    if (!draft) continue;
    const slug = (draft.slug as { current?: string } | undefined)?.current;
    const lang = draft.language as string | undefined;
    const pub = await client.fetch<string | null>(
      `*[_type=="service" && !(_id in path("drafts.**")) && slug.current==$s && language==$l][0]._id`,
      { s: slug, l: lang },
    );
    if (pub) {
      refMap[id] = pub;
      console.log(`dup ${slug} (${lang}) -> published ${pub}`);
    } else {
      console.log(`dup ${slug} (${lang}) has NO published target (will just delete)`);
    }
  }

  // 1. Create published versions from the 36 drafts
  for (const id of TO_PUBLISH) {
    const draft = await client.getDocument(id);
    if (!draft) {
      console.log("skip missing draft", id);
      continue;
    }
    const bareId = id.replace(/^drafts\./, "");
    const { _id, _rev, _createdAt, _updatedAt, ...rest } = draft as AnyDoc;
    await client.createOrReplace({ ...(rest as AnyDoc), _id: bareId } as never);
    console.log(
      `+ published ${bareId}  ${(draft.slug as { current?: string })?.current} (${draft.language})`,
    );
  }

  // 2. Repoint every referencing document
  const allDraftIds = [...TO_PUBLISH, ...DUPS];
  const referencing = await client.fetch<AnyDoc[]>(`*[references($ids)]`, { ids: allDraftIds });
  for (const doc of referencing) {
    const updated = deepReplaceRef(doc, refMap) as AnyDoc;
    if (JSON.stringify(updated) !== JSON.stringify(doc)) {
      await client.createOrReplace(updated as never);
      console.log(`~ repointed refs in ${doc._id} (${doc._type})`);
    }
  }

  // 3. Delete drafts (published-from + dups). Re-check no leftover strong refs.
  for (const id of allDraftIds) {
    const stillRef = await client.fetch<number>(`count(*[references($id)])`, { id });
    if (stillRef > 0) {
      console.log(`! ${id} still referenced by ${stillRef} doc(s), skipping delete`);
      continue;
    }
    try {
      await client.delete(id);
      console.log(`- deleted draft ${id}`);
    } catch (e) {
      console.log(`! delete failed ${id}: ${(e as Error).message}`);
    }
  }

  // Final tally
  const published = await client.fetch<number>(
    `count(*[_type=="service" && !(_id in path("drafts.**"))])`,
  );
  const drafts = await client.fetch<number>(
    `count(*[_type=="service" && _id in path("drafts.**")])`,
  );
  console.log(`\nDone. Published services: ${published}. Remaining service drafts: ${drafts}.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
