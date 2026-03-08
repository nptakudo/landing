import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/layout/docs-shell";
import { getNavigationRoot, getPublishedNotes } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Docs",
  description: "Browse published notes by folder, backlinks, tags, and recent updates.",
  alternates: {
    canonical: "/docs",
  },
};

export default async function DocsIndexPage() {
  const [notes, navigation] = await Promise.all([
    getPublishedNotes(),
    getNavigationRoot(),
  ]);

  return (
    <DocsShell navigation={navigation}>
      <main className="space-y-8">
        <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Docs Index
          </p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight text-[var(--foreground)]">
            Browse notes by folder, backlinks, and tags.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
            This index is already driven by the mirrored published-note set,
            with the example content fallback keeping the shell usable before a
            larger vault is attached.
          </p>
        </section>

        <section className="grid gap-4">
          {notes.map((note) => (
            <Link
              key={note.slug}
              href={`/docs/${note.slug}`}
              className="rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition hover:border-[var(--border-strong)]"
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
            </Link>
          ))}
        </section>
      </main>
    </DocsShell>
  );
}
