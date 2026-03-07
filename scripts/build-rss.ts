import fs from "node:fs/promises";
import path from "node:path";
import { getAllNotes } from "../lib/content/load-content";
import { siteConfig } from "../lib/site/config";

async function main() {
  const output = path.join(process.cwd(), "public", "rss.xml");
  const notes = await getAllNotes();

  const items = notes
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 30)
    .map(
      (note) => `
    <item>
      <title><![CDATA[${note.title}]]></title>
      <link>${siteConfig.url}/docs/${note.slug}</link>
      <guid>${siteConfig.url}/docs/${note.slug}</guid>
      <pubDate>${new Date(note.updatedAt).toUTCString()}</pubDate>
      <description><![CDATA[${note.summary}]]></description>
    </item>`,
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, rss, "utf8");

  console.log(`RSS feed written to ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
