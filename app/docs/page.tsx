import Link from "next/link";
import { getAllNotes } from "@/lib/content/load-content";

export default async function DocsIndexPage() {
  const notes = await getAllNotes();

  return (
    <section className="space-y-4">
      <h1 className="font-serif text-3xl">Docs index</h1>
      <p className="text-[var(--muted)]">Published notes from Obsidian sync.</p>
      <ul className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
        {notes.map((note) => (
          <li key={note.slug}>
            <Link href={`/docs/${note.slug}`} className="font-medium hover:underline">
              {note.title}
            </Link>
            <p className="text-xs text-[var(--muted)]">/{note.slug}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
