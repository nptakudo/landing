import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/layout/docs-shell";
import { getNavigationRoot, getPublishedNotes, getTagArchive } from "@/lib/site/content";

export async function generateStaticParams() {
  const tags = await getTagArchive();
  return [...tags.keys()].map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `#${decodedTag}`,
    description: `Published notes tagged with ${decodedTag}.`,
    alternates: {
      canonical: `/tags/${encodeURIComponent(decodedTag)}`,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const [tags, navigation, notes] = await Promise.all([
    getTagArchive(),
    getNavigationRoot(),
    getPublishedNotes(),
  ]);
  const matching = tags.get(decodedTag) ?? notes.filter((note) => note.tags.includes(decodedTag));

  return (
    <DocsShell navigation={navigation}>
      <main className="space-y-6">
        <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Tag archive
          </p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight text-[var(--foreground)]">
            #{decodedTag}
          </h1>
        </section>
        {matching.map((note) => (
          <article
            key={`${tag}-${note.slug}`}
            className="rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              {(note.folderSegments[0] ?? "Notes").replace(/-/g, " ")} ·{" "}
              {note.updatedAt?.slice(0, 10) ?? "Published"}
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-[var(--foreground)]">
              {note.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {note.description ?? note.excerpt}
            </p>
            <div className="mt-4">
              <Link
                href={`/docs/${note.slug}`}
                className="text-sm font-semibold text-[var(--foreground)]"
              >
                Read note
              </Link>
            </div>
          </article>
        ))}
      </main>
    </DocsShell>
  );
}
