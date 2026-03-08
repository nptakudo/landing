import Link from "next/link";
import { getAllNotes } from "@/lib/content/load-content";

export default async function DocsIndexPage() {
  const notes = await getAllNotes();
  const folders = new Set(notes.map((note) => note.folder)).size;

  return (
    <section className="mx-auto max-w-[860px] space-y-5">
      <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Documentation</p>
        <h1 className="mt-2 font-serif text-5xl tracking-[-0.02em] text-[var(--brand)]">Docs index</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Published notes from your Obsidian sync. File-based, backlink-aware, and generated statically.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5">
            {notes.length} notes
          </span>
          <span className="rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5">
            {folders} folders
          </span>
        </div>
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-soft)]">
        <ul className="divide-y divide-[var(--border)]">
          {notes.map((note) => (
            <li key={note.slug}>
              <Link
                href={`/docs/${note.slug}`}
                className="block rounded-lg px-4 py-3 hover:bg-[var(--surface-muted)]"
              >
                <p className="font-serif text-[1.75rem] leading-tight tracking-[-0.01em] text-[var(--text-strong)]">
                  {note.title}
                </p>
                <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">{note.summary}</p>
                <p className="mt-1.5 text-[0.72rem] uppercase tracking-[0.13em] text-[var(--muted)]">
                  /{note.slug}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
