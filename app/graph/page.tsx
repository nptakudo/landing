import Link from "next/link";
import { getAllNotes } from "@/lib/content/load-content";

export default async function GraphPage() {
  const notes = await getAllNotes();
  const edges = notes.flatMap((note) =>
    note.outboundLinks
      .filter((link) => link.resolvedSlug)
      .map((link) => `${note.slug} -> ${link.resolvedSlug}`),
  );

  return (
    <section className="space-y-3">
      <h1 className="font-serif text-3xl">Relationship graph</h1>
      <p className="text-[var(--muted)]">
        Lightweight relationship view generated from wikilinks.
      </p>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6">
        <p className="mb-3 text-sm font-semibold">Nodes: {notes.length}</p>
        <ul className="space-y-1 text-sm text-[var(--muted)]">
          {edges.slice(0, 20).map((edge) => (
            <li key={edge}>{edge}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {notes.map((note) => (
          <Link
            key={note.slug}
            href={`/docs/${note.slug}`}
            className="rounded-full border border-[var(--border)] px-3 py-1 text-xs"
          >
            {note.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
