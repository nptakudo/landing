import Link from "next/link";
import { ArrowRight, NotebookPen } from "lucide-react";
import { DocsShell } from "@/components/layout/docs-shell";
import { getFeaturedNotes, getNavigationRoot } from "@/lib/site/content";
import { siteConfig } from "@/site.config";
import { TagChip } from "@/components/primitives/tag-chip";

export default async function Home() {
  const [notes, navigation] = await Promise.all([
    getFeaturedNotes(),
    getNavigationRoot(),
  ]);

  return (
    <DocsShell navigation={navigation}>
      <main className="space-y-12">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-strong)] bg-[var(--surface)] p-8 shadow-[var(--shadow-hero)] sm:p-12">
          {/* Animated mesh grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent-surface),transparent_50%),radial-gradient(ellipse_at_bottom_left,var(--accent-surface),transparent_50%)] opacity-70" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]" />

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <p
                className="animate-fade-up text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent)]"
                style={{ animationDelay: "0ms" }}
              >
                Published from Obsidian · {siteConfig.location}
              </p>
              <h1
                className="animate-fade-up max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-7xl"
                style={{ animationDelay: "100ms" }}
              >
                Personal docs with the calm of a digital garden <br className="hidden sm:block" /> and the clarity of a reference shelf.
              </h1>
              <p
                className="animate-fade-up max-w-2xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl"
                style={{ animationDelay: "200ms" }}
              >
                {siteConfig.intro}
              </p>
              <div
                className="animate-fade-up flex flex-col gap-4 sm:flex-row"
                style={{ animationDelay: "300ms" }}
              >
                <Link
                  href="/docs"
                  className="group relative inline-flex h-12 flex-none items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--accent)] px-8 text-sm font-semibold text-white transition-all duration-[--motion-fast] hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5"
                >
                  Explore notes
                  <ArrowRight className="h-4 w-4 transition-transform duration-[--motion-fast] group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent)]" />
                </Link>
                <Link
                  href="/graph"
                  className="inline-flex h-12 flex-none items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-8 text-sm font-semibold text-[var(--foreground)] transition-all duration-[--motion-fast] hover:bg-[var(--surface)] hover:-translate-y-0.5"
                >
                  View graph
                </Link>
              </div>
            </div>

            {/* Live animated skeleton */}
            <div
              className="animate-fade-up rounded-[2rem] border border-[var(--border-soft)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]"
              style={{ animationDelay: "400ms" }}
            >
              <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                <span>Preview shell</span>
                <span className="hidden sm:block">Left rail + article + outline</span>
              </div>
              <div className="grid min-h-[22rem] gap-4 rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface)] p-4 lg:grid-cols-[160px_1fr_140px]">
                <div className="space-y-3 rounded-[1.25rem] bg-[var(--surface-elevated)] p-4">
                  <div className="h-2.5 w-18 rounded-full bg-[var(--border-strong)]" />
                  <div className="space-y-2 pt-4">
                    <div className="h-8 rounded-full bg-[var(--panel)] animate-pulse" />
                    <div className="h-8 rounded-full bg-[var(--panel)] animate-pulse" style={{ animationDelay: "150ms" }} />
                    <div className="h-8 rounded-full bg-[var(--panel)] animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
                <div className="space-y-4 rounded-[1.25rem] bg-[var(--panel)] p-5">
                  <div className="h-3 w-24 rounded-full bg-[var(--border-strong)] animate-pulse" />
                  <div className="h-10 w-full rounded-[1rem] bg-[var(--surface-elevated)] animate-pulse" />
                  <div className="space-y-3 pt-2">
                    <div className="h-2 rounded-full bg-[var(--border-soft)] animate-pulse" />
                    <div className="h-2 rounded-full bg-[var(--border-soft)] animate-pulse" />
                    <div className="h-2 w-4/5 rounded-full bg-[var(--border-soft)] animate-pulse" />
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="h-2 rounded-full bg-[var(--border-soft)] animate-pulse" />
                    <div className="h-2 rounded-full bg-[var(--border-soft)] animate-pulse" />
                    <div className="h-2 w-3/5 rounded-full bg-[var(--border-soft)] animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3 rounded-[1.25rem] bg-[var(--surface-elevated)] p-4">
                  <div className="h-2.5 w-16 rounded-full bg-[var(--border-strong)]" />
                  <div className="space-y-2 pt-2">
                    <div className="h-2 w-full rounded-full bg-[var(--panel)] animate-pulse" />
                    <div className="h-2 w-full rounded-full bg-[var(--panel)] animate-pulse" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-4/5 rounded-full bg-[var(--panel)] animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {notes.map((note, idx) => (
            <Link
              key={note.slug}
              href={`/docs/${note.slug}`}
              className="animate-fade-up group relative flex flex-col justify-between rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface)] p-7 shadow-[var(--shadow-soft)] transition-all duration-[--motion-base] hover:-translate-y-1.5 hover:border-[var(--accent-border)] hover:bg-[var(--surface-elevated)] hover:shadow-[var(--shadow-hero)]"
              style={{ animationDelay: `${500 + idx * 100}ms` }}
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <TagChip>
                    {(note.folderSegments[0] ?? "Notes").replace(/-/g, " ")}
                  </TagChip>
                  <span className="text-xs text-[var(--muted)]">
                    {note.updatedAt?.slice(0, 10) ?? "Published"}
                  </span>
                </div>
                <h2 className="font-serif text-2xl leading-tight tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors duration-[--motion-fast]">
                  {note.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] line-clamp-3">
                  {note.description ?? note.excerpt}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors duration-[--motion-fast]">
                  Read note
                  <ArrowRight className="h-4 w-4 transition-transform duration-[--motion-base] group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </DocsShell>
  );
}
