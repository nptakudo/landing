import Link from "next/link";
import { HomeHero } from "@/components/content/home-hero";
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
    <div className="space-y-7 lg:space-y-8">
      <HomeHero notesCount={notes.length} />

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5">
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">Published notes</p>
          <p className="mt-1.5 text-3xl font-semibold text-[var(--text-strong)]">{notes.length}</p>
        </article>
        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5">
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">Tags indexed</p>
          <p className="mt-1.5 text-3xl font-semibold text-[var(--text-strong)]">{tags.length}</p>
        </article>
        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5">
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted)]">Updated this week</p>
          <p className="mt-1.5 text-3xl font-semibold text-[var(--text-strong)]">{withinWeekCount}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-3xl text-[var(--brand)]">Latest notes</h2>
            <Link
              href="/docs"
              className="rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted-strong)] hover:border-[var(--border-strong)]"
            >
              See all
            </Link>
          </div>
          <ul className="mt-4 space-y-2.5">
            {recent.map((note) => (
              <li key={note.slug}>
                <Link
                  href={`/docs/${note.slug}`}
                  className="block rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2.5 hover:border-[var(--border-strong)]"
                >
                  <p className="font-semibold text-[var(--text-strong)]">{note.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{note.summary}</p>
                  <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-2xl text-[var(--brand)]">Popular tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--muted-strong)] hover:border-[var(--border-strong)]"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-2xl text-[var(--brand)]">Link intelligence</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Every published note includes resolved wikilinks, backlinks, related notes, and heading anchors.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/docs"
                className="rounded-md border border-[var(--brand)] bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-[color-mix(in_oklab,var(--brand),black_8%)]"
              >
                Read docs
              </Link>
              <Link
                href="/graph"
                className="rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted-strong)] hover:border-[var(--border-strong)]"
              >
                Graph overview
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
