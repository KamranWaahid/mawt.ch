/**
 * Parses `.cursor/briefs/content/service-detail-pages.md` into JSON for populate script.
 * Run: node scripts/parse-service-brief.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const briefPath = path.join(__dirname, "../.cursor/briefs/content/service-detail-pages.md");
const outPath = path.join(__dirname, "data/v18-service-content.json");

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

const serviceSectionRe = /## [\d.]+ — `([^`]+)` \/ `([^`]+)`([\s\S]*?)(?=\n## |\n# F\d|$)/g;
const services = {};

let match;
while ((match = serviceSectionRe.exec(md)) !== null) {
  const frSlug = match[1];
  const enSlug = match[2];
  const body = match[3];

  for (const [lang, slug] of [
    ["fr", frSlug],
    ["en", enSlug],
  ]) {
    const langMarker = lang === "fr" ? "### 🇫🇷 FR" : "### 🇬🇧 EN";
    const langStart = body.indexOf(langMarker);
    if (langStart === -1) continue;
    const nextLang = lang === "fr" ? body.indexOf("### 🇬🇧 EN") : body.length;
    const section = body.slice(langStart, nextLang === -1 ? body.length : nextLang);

    const metaBlock = parseBlock(section, "\\*\\*Meta\\*\\*");
    const heroBlock = parseBlock(section, "\\*\\*Hero\\*\\*");
    const featuresBlock = parseBlock(section, "\\*\\*Features\\*\\*");

    const key = `${lang}:${slug}`;
    services[key] = {
      slug,
      lang,
      metaTitle: parseField(metaBlock, "Title"),
      metaDescription: parseField(metaBlock, "Description"),
      heroH1: parseField(heroBlock, "H1"),
      heroH2: parseField(heroBlock, "H2"),
      description: parseBlock(section, "\\*\\*Short description\\*\\*"),
      longDescription: parseBlock(section, "\\*\\*Long description\\*\\*"),
      features: featuresBlock
        .split("\n")
        .map((line) => line.replace(/^-\s*/, "").trim())
        .filter(Boolean),
    };
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(services, null, 2));
console.log(`Parsed ${Object.keys(services).length} service language entries → ${outPath}`);
