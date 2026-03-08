import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { buildSearchIndex, loadPublishedNotes } from "../src/lib/content";
import { exampleContentRoot, mirroredContentRoot } from "../src/lib/site/source";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repoRoot, "public", "search-index.json");

const mirroredNotes = await loadPublishedNotes(mirroredContentRoot);
const notes = mirroredNotes.length > 0 ? mirroredNotes : await loadPublishedNotes(exampleContentRoot);
const searchIndex = buildSearchIndex(notes);

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(searchIndex, null, 2));

console.log(`Wrote ${searchIndex.length} search entries to ${outputPath}`);
