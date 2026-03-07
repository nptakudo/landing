import Link from "next/link";
import { HomeHero } from "@/components/content/home-hero";
import { SimpleTabs } from "@/components/primitives/tabs";
import { getAllNotes, getAllTags } from "@/lib/content/load-content";

export default async function Home() {
  const notes = await getAllNotes();
  const tags = await getAllTags();
  const recent = [...notes]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <HomeHero notesCount={notes.length} />
      <SimpleTabs
        defaultValue="recent"
        tabs={[
          {
            value: "recent",
            label: "Recent",
            content: (
              <ul className="space-y-2 text-sm">
                {recent.map((note) => (
                  <li key={note.slug}>
                    <Link href={`/docs/${note.slug}`} className="hover:underline">
                      {note.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            value: "tags",
            label: "Tags",
            content: (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ),
          },
          {
            value: "backlinks",
            label: "Backlinks",
            content: (
              <p className="text-sm text-[var(--muted)]">
                Backlinks are shown on each note page from the resolved wikilink graph.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}
