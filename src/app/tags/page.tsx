import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/layout/docs-shell";
import { getNavigationRoot, getTagArchive } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse published notes by tag cluster.",
  alternates: {
    canonical: "/tags",
  },
};

export default async function TagsIndexPage() {
  const [navigation, tags] = await Promise.all([getNavigationRoot(), getTagArchive()]);
  const sortedTags = [...tags.entries()].sort((left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0]));

  return (
    <DocsShell navigation={navigation}>
      <main className="space-y-6">
        <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Tag archive
          </p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight text-[var(--foreground)]">
            Browse your note clusters
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
            Tags act as the second navigation layer beside the folder tree, making cross-cutting topics easy to revisit.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sortedTags.map(([tag, notes]) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
              </p>
              <p className="mt-2 font-serif text-3xl tracking-tight text-[var(--foreground)]">
                #{tag}
              </p>
            </Link>
          ))}
        </section>
      </main>
    </DocsShell>
  );
}
