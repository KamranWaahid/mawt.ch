/**
 * Parses `.cursor/briefs/content/projects-case-studies.md` into JSON.
 * Run: node scripts/parse-project-brief.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const briefPath = path.join(__dirname, "../.cursor/briefs/content/projects-case-studies.md");
const outPath = path.join(__dirname, "data/v18-project-content.json");

const md = fs.readFileSync(briefPath, "utf8");

function parseBlock(section, label) {
  const re = new RegExp(`${label}\\s*\\n\`\`\`\\s*\\n([\\s\\S]*?)\\n\`\`\``, "m");
  const match = section.match(re);
  return match ? match[1].trim() : "";
}

function parseField(block, field) {
  const re = new RegExp(`^${field}\\s*:\\s*(.+)$`, "m");
  const match = block.match(re);
  return match ? match[1].trim() : "";
}

function parseList(block) {
  return block
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const projects = {};

const featuredDefs = [
  { slug: "crown", marker: "# Featured case study 1 — Crown 360 transformation", featuredHomepage: true },
  { slug: "mellender", marker: "# Featured case study 2 — Mellender real estate platform", featuredHomepage: true },
  { slug: "legumes-express", marker: "# Featured case study 3 — Légumes Express multichannel ordering", featuredHomepage: true },
];

for (const def of featuredDefs) {
  const start = md.indexOf(def.marker);
  const nextFeatured = featuredDefs.find((d) => d.marker !== def.marker && md.indexOf(d.marker) > start);
  const end = nextFeatured ? md.indexOf(nextFeatured.marker) : md.indexOf("# Shorter case studies");
  const body = md.slice(start, end === -1 ? md.length : end);

  for (const lang of ["fr", "en"]) {
    const marker = lang === "fr" ? "## 🇫🇷 FR" : "## 🇬🇧 EN";
    const langStart = body.indexOf(marker);
    if (langStart === -1) continue;
    const langEnd = lang === "fr" ? body.indexOf("## 🇬🇧 EN") : body.length;
    const section = body.slice(langStart, langEnd === -1 ? body.length : langEnd);

    const servicesBlock = parseBlock(section, "### Services tags");
    const familyBlock = parseBlock(section, "### Family tag");
    const primaryMatch = familyBlock.match(/Primary\s*:\s*(\S+)/);
    const secondaryMatch = familyBlock.match(/Secondary\s*:\s*(\S+)/);

    projects[`${lang}:${def.slug}`] = {
      slug: def.slug,
      lang,
      featuredHomepage: def.featuredHomepage,
      metaTitle: parseField(parseBlock(section, "### Meta"), "Title"),
      metaDescription: parseField(parseBlock(section, "### Meta"), "Description"),
      heroH1: parseField(parseBlock(section, "### Hero"), "H1"),
      heroH2: parseField(parseBlock(section, "### Hero"), "H2"),
      pitch: parseField(parseBlock(section, "### Hero"), "Pitch"),
      cardTeaser: parseBlock(section, "### Card teaser"),
      challenge: parseBlock(section, "### The challenge"),
      solution: parseBlock(section, "### What we built"),
      outcome: parseBlock(section, "### Outcome"),
      serviceSlugs: parseList(servicesBlock).map((line) => {
        const parts = line.split(/\s+\/\s+/);
        return lang === "fr" ? parts[0]?.trim() : parts[1]?.trim() || parts[0]?.trim();
      }),
      family: primaryMatch?.[1] || "",
      secondaryFamily: secondaryMatch?.[1] || undefined,
    };
  }
}

const shortSection = md.slice(md.indexOf("# Shorter case studies"));
const shortRe = /## ([^\n]+)([\s\S]*?)(?=\n## |\n---|\n## Implementation|$)/g;
let sm;
while ((sm = shortRe.exec(shortSection)) !== null) {
  const heading = sm[1].trim();
  if (!heading.includes("—")) continue;
  const body = sm[2];
  const slug = slugify(heading.split("—")[0].trim());

  for (const lang of ["fr", "en"]) {
    const marker = lang === "fr" ? "### FR" : "### EN";
    const start = body.indexOf(marker);
    if (start === -1) continue;
    const end = lang === "fr" ? body.indexOf("### EN") : body.length;
    const section = body.slice(start, end === -1 ? body.length : end);

    const servicesLine = parseField(section, "Services");
    const synthesis = parseField(section, "Synthesis");
    projects[`${lang}:${slug}`] = {
      slug,
      lang,
      featuredHomepage: false,
      metaTitle: parseField(section, "Title"),
      metaDescription: parseField(section, "Description"),
      heroH1: parseField(section, "H1"),
      heroH2: parseField(section, "H2"),
      pitch: "",
      cardTeaser: parseField(section, "Card teaser"),
      challenge: "",
      solution: synthesis,
      outcome: synthesis,
      serviceSlugs: servicesLine ? servicesLine.split(",").map((s) => s.trim()) : [],
      family: parseField(section, "Family"),
    };
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(projects, null, 2));
console.log(`Parsed ${Object.keys(projects).length} project language entries → ${outPath}`);
