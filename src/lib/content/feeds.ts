import { siteConfig } from "../../../site.config";
import { compareNotesBySlug, compareStrings } from "./order";
import type { PublishedNote } from "./types";

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

export function collectTagArchive(notes: PublishedNote[]) {
  return [...new Set(notes.flatMap((note) => note.tags))].sort(compareStrings);
}

export function buildRssXml(notes: PublishedNote[]) {
  const rssItems = notes
    .slice()
    .sort((left, right) => {
      const dateComparison = (right.updatedAt ?? right.createdAt ?? "").localeCompare(
        left.updatedAt ?? left.createdAt ?? "",
      );
      return dateComparison || compareNotesBySlug(left, right);
    })
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

  return `<?xml version="1.0" encoding="UTF-8"?>
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
}

export function buildSitemapXml(notes: PublishedNote[]) {
  const tags = collectTagArchive(notes);
  const sitemapEntries = [
    "",
    "/docs",
    "/graph",
    "/tags",
    ...notes.slice().sort(compareNotesBySlug).map((note) => `/docs/${note.slug}`),
    ...tags.map((tag) => `/tags/${encodeURIComponent(tag)}`),
  ]
    .map((pathname) => `  <url><loc>${absoluteUrl(pathname || "/")}</loc></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;
}

export function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;
}
