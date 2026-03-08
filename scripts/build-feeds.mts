import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRobotsTxt,
  buildRssXml,
  buildSitemapXml,
  loadPublishedNotes,
} from "../src/lib/content";
import { exampleContentRoot, mirroredContentRoot } from "../src/lib/site/source";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(repoRoot, "public");

const mirroredNotes = await loadPublishedNotes(mirroredContentRoot);
const notes = mirroredNotes.length > 0 ? mirroredNotes : await loadPublishedNotes(exampleContentRoot);

await fs.mkdir(publicRoot, { recursive: true });
await Promise.all([
  fs.writeFile(path.join(publicRoot, "rss.xml"), buildRssXml(notes)),
  fs.writeFile(path.join(publicRoot, "sitemap.xml"), buildSitemapXml(notes)),
  fs.writeFile(path.join(publicRoot, "robots.txt"), buildRobotsTxt()),
]);

console.log(`Wrote rss.xml, sitemap.xml, and robots.txt for ${notes.length} notes to ${publicRoot}`);
