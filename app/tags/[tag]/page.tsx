import Link from "next/link";
import { getAllTags, getNotesByTag } from "@/lib/content/load-content";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const notes = await getNotesByTag(tag);

  return (
    <section className="space-y-4">
      <header className="surface-card rounded-2xl p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Tag archive</p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight">#{tag}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{notes.length} notes reference this tag.</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {notes.map((note) => (
          <li key={note.slug} className="surface-card rounded-2xl p-4">
            <Link href={`/docs/${note.slug}`} className="font-semibold hover:underline">
              {note.title}
            </Link>
            <p className="mt-2 text-xs text-[var(--muted)]">/{note.slug}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
