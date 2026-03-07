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
    <section className="space-y-3">
      <h1 className="font-serif text-3xl">Tag: {tag}</h1>
      <ul className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
        {notes.map((note) => (
          <li key={note.slug}>
            <Link href={`/docs/${note.slug}`} className="hover:underline">
              {note.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
