import Link from "next/link";
import { getAllNotes } from "@/lib/content/load-content";

export default async function DocsIndexPage() {
  const notes = await getAllNotes();
  const folders = new Set(notes.map((note) => note.folder)).size;

  return (
    <section className="space-y-5">
      <header className="surface-card rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Explorer</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Docs index</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Published notes from your Obsidian sync, grouped by folders and sorted for scanning.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5">
            {notes.length} notes
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5">
            {folders} folders
          </span>
        </div>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {notes.map((note) => (
          <li key={note.slug} className="surface-card rounded-2xl p-4">
            <Link href={`/docs/${note.slug}`} className="font-serif text-2xl leading-tight hover:underline">
              {note.title}
            </Link>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{note.summary}</p>
            <p className="mt-3 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--muted)]">
              /{note.slug}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
