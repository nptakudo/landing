import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPublishedNotes } from "../src/lib/content";
import { exampleContentRoot, mirroredContentRoot } from "../src/lib/site/source";
import { siteConfig } from "../site.config";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(repoRoot, "public");

function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString();
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const mirroredNotes = await loadPublishedNotes(mirroredContentRoot);
const notes = mirroredNotes.length > 0 ? mirroredNotes : await loadPublishedNotes(exampleContentRoot);
const tags = [...new Set(notes.flatMap((note) => note.tags))].sort();

const rssItems = notes
  .slice()
  .sort((left, right) => (right.updatedAt ?? "").localeCompare(left.updatedAt ?? ""))
  .map((note) => {
    const noteUrl = absoluteUrl(`/docs/${note.slug}`);
    const pubDate = note.updatedAt ?? note.createdAt ?? new Date().toISOString();

    return `  <item>
    <title>${escapeXml(note.title)}</title>
    <link>${noteUrl}</link>
    <guid>${noteUrl}</guid>
    <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
    <description>${escapeXml(note.description ?? note.excerpt)}</description>
  </item>`;
  })
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteConfig.title)}</title>
  <link>${siteConfig.url}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  <language>en</language>
${rssItems}
</channel>
</rss>
`;

const sitemapEntries = [
  "",
  "/docs",
  "/graph",
  "/tags",
  ...notes.map((note) => `/docs/${note.slug}`),
  ...tags.map((tag) => `/tags/${encodeURIComponent(tag)}`),
]
  .map((pathname) => `  <url><loc>${absoluteUrl(pathname || "/")}</loc></url>`)
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;

await fs.mkdir(publicRoot, { recursive: true });
await Promise.all([
  fs.writeFile(path.join(publicRoot, "rss.xml"), rss),
  fs.writeFile(path.join(publicRoot, "sitemap.xml"), sitemap),
  fs.writeFile(path.join(publicRoot, "robots.txt"), robots),
]);

console.log(
  `Wrote rss.xml, sitemap.xml, and robots.txt for ${notes.length} notes and ${tags.length} tags to ${publicRoot}`,
);
