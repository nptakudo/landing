import fs from "node:fs/promises";
import path from "node:path";
import { getAllNotes } from "../lib/content/load-content";

async function main() {
  const output = path.join(process.cwd(), "public", "search-index.json");
  const notes = await getAllNotes();

  const entries = notes.map((note) => ({
    id: note.slug,
    title: note.title,
    slug: note.slug,
    aliases: note.aliases.join(" "),
    tags: note.tags.join(" "),
    headings: note.toc.map((heading) => heading.text).join(" "),
    body: note.content,
  }));

  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(
    output,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        entries,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Search index written to ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
