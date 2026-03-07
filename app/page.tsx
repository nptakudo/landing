import Link from "next/link";
import { HomeHero } from "@/components/content/home-hero";
import { SimpleTabs } from "@/components/primitives/tabs";
import { getAllNotes, getAllTags } from "@/lib/content/load-content";

export default async function Home() {
  const notes = await getAllNotes();
  const tags = await getAllTags();
  const recent = [...notes]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);
  const latestUpdateMs = recent[0] ? new Date(recent[0].updatedAt).getTime() : 0;
  const withinWeekCount = notes.filter((note) => {
    const updatedMs = new Date(note.updatedAt).getTime();
    return latestUpdateMs > 0 && latestUpdateMs - updatedMs <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="space-y-8 lg:space-y-10">
      <HomeHero notesCount={notes.length} />
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Published notes</p>
          <p className="mt-2 font-serif text-3xl">{notes.length}</p>
        </article>
        <article className="surface-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Tags indexed</p>
          <p className="mt-2 font-serif text-3xl">{tags.length}</p>
        </article>
        <article className="surface-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Updated this week</p>
          <p className="mt-2 font-serif text-3xl">{withinWeekCount}</p>
        </article>
      </section>
      <SimpleTabs
        defaultValue="recent"
        tabs={[
          {
            value: "recent",
            label: "Recent",
            content: (
              <ul className="space-y-3 text-sm">
                {recent.map((note) => (
                  <li key={note.slug} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                    <Link href={`/docs/${note.slug}`} className="text-base font-semibold hover:underline">
                      {note.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{note.summary}</p>
                    <p className="mt-2 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                      Updated {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
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
                    className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs hover:border-[var(--border-strong)]"
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
              <div className="space-y-2">
                <p className="text-sm text-[var(--muted)]">
                  Every note page includes inbound links from the resolved wikilink graph.
                </p>
                <Link
                  href="/docs"
                  className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold hover:border-[var(--border-strong)]"
                >
                  Open the docs explorer
                </Link>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
