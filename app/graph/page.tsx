import Link from "next/link";
import { getAllNotes } from "@/lib/content/load-content";

export default async function GraphPage() {
  const notes = await getAllNotes();
  const edges = notes.flatMap((note) =>
    note.outboundLinks
      .filter((link) => link.resolvedSlug)
      .map((link) => `${note.slug} -> ${link.resolvedSlug}`),
  );
  const densest = [...notes]
    .sort((a, b) => b.backlinks.length + b.outboundLinks.length - (a.backlinks.length + a.outboundLinks.length))
    .slice(0, 6);

  return (
    <section className="space-y-4">
      <header className="surface-card rounded-2xl p-6 sm:p-7">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Relationship graph</p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">Link topology</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Lightweight relationship view generated from resolved wikilinks and backlinks.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5">
            {notes.length} nodes
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5">
            {edges.length} edges
          </span>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="surface-card rounded-2xl p-5">
          <h2 className="font-serif text-2xl">Sample edges</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-[var(--muted)]">
            {edges.slice(0, 20).map((edge) => (
              <li key={edge} className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1.5">
                {edge}
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card rounded-2xl p-5">
          <h2 className="font-serif text-2xl">Most connected notes</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {densest.map((note) => (
              <li key={note.slug} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                <Link href={`/docs/${note.slug}`} className="font-semibold hover:underline">
                  {note.title}
                </Link>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {note.backlinks.length} backlinks ·{" "}
                  {note.outboundLinks.filter((link) => link.resolvedSlug).length} outbound links
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
