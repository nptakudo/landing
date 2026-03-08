import Link from "next/link";
import { ArrowRight, NotebookPen } from "lucide-react";
import { DocsShell } from "@/components/layout/docs-shell";
import { getFeaturedNotes, getNavigationRoot } from "@/lib/site/content";
import { siteConfig } from "@/site.config";

export default async function Home() {
  const [notes, navigation] = await Promise.all([
    getFeaturedNotes(),
    getNavigationRoot(),
  ]);

  return (
    <DocsShell navigation={navigation}>
      <main className="space-y-10">
        <section className="overflow-hidden rounded-[2.5rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(227,221,208,0.92))] p-8 shadow-[var(--shadow-hero)] dark:bg-[linear-gradient(135deg,rgba(23,27,36,0.92),rgba(11,14,21,0.98))] sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                Published from Obsidian · {siteConfig.location}
              </p>
              <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight text-[var(--foreground)] sm:text-7xl">
                Personal docs with the calm of a digital garden and the clarity of a reference shelf.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                {siteConfig.intro}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/docs"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-6 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5"
                >
                  Explore notes
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/graph"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-6 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5"
                >
                  View graph
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
              <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                <span>Preview shell</span>
                <span>Left rail + article + outline</span>
              </div>
              <div className="grid min-h-[22rem] gap-4 rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface)] p-4 lg:grid-cols-[180px_1fr_160px]">
                <div className="space-y-2 rounded-[1.25rem] bg-[var(--surface-elevated)] p-4">
                  <div className="h-2.5 w-18 rounded-full bg-[var(--border-strong)]" />
                  <div className="space-y-2 pt-4">
                    <div className="h-8 rounded-full bg-[var(--panel)]" />
                    <div className="h-8 rounded-full bg-[var(--panel)]" />
                    <div className="h-8 rounded-full bg-[var(--panel)]" />
                  </div>
                </div>
                <div className="space-y-4 rounded-[1.25rem] bg-[var(--panel)] p-5">
                  <div className="h-3 w-24 rounded-full bg-[var(--border-strong)]" />
                  <div className="h-11 w-full rounded-[1rem] bg-[var(--surface-elevated)]" />
                  <div className="space-y-3">
                    <div className="h-3 rounded-full bg-[var(--border-soft)]" />
                    <div className="h-3 rounded-full bg-[var(--border-soft)]" />
                    <div className="h-3 w-4/5 rounded-full bg-[var(--border-soft)]" />
                  </div>
                </div>
                <div className="space-y-2 rounded-[1.25rem] bg-[var(--surface-elevated)] p-4">
                  <div className="h-2.5 w-16 rounded-full bg-[var(--border-strong)]" />
                  <div className="h-7 rounded-full bg-[var(--panel)]" />
                  <div className="h-7 rounded-full bg-[var(--panel)]" />
                  <div className="h-7 rounded-full bg-[var(--panel)]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {notes.map((note) => (
            <Link
              key={note.slug}
              href={`/docs/${note.slug}`}
              className="group rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-[var(--border-strong)]"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                {(note.folderSegments[0] ?? "Notes").replace(/-/g, " ")} ·{" "}
                {note.updatedAt?.slice(0, 10) ?? "Published"}
              </p>
              <h2 className="font-serif text-3xl leading-tight tracking-tight text-[var(--foreground)]">
                {note.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {note.description ?? note.excerpt}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                Read note
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </section>

        <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <NotebookPen className="h-5 w-5 text-[var(--muted)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Milestone 1
            </p>
          </div>
          <h2 className="mt-4 font-serif text-4xl tracking-tight text-[var(--foreground)]">
            The shell is live and ready for local iteration.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)]">
            This foundation establishes the premium left rail, centered article
            column, and right-side outline container that now carries the
            mirrored note pipeline, search flow, and graph navigation model.
          </p>
        </section>
      </main>
    </DocsShell>
  );
}
