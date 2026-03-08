import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Link2, Search, GitBranch, Moon, BookOpen, Command } from "lucide-react";
import { DocsShell } from "@/components/layout/docs-shell";
import { TypewriterHero } from "@/components/motion/typewriter-hero";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TagChip } from "@/components/primitives/tag-chip";
import { getFeaturedNotes, getNavigationRoot, getPublishedNotes } from "@/lib/site/content";
import { siteConfig } from "@/site.config";

const features = [
  {
    icon: Link2,
    title: "Wikilinks",
    description: "All [[wikilinks]] resolve to real routes with backlinks and related notes.",
  },
  {
    icon: Search,
    title: "Full-text search",
    description: "Search across titles, tags, headings, and body with fuzzy matching.",
  },
  {
    icon: GitBranch,
    title: "Knowledge graph",
    description: "Interactive force-directed graph to explore connections between notes.",
  },
  {
    icon: Moon,
    title: "Dark mode",
    description: "One-click theme toggle with carefully tuned dark tokens.",
  },
  {
    icon: BookOpen,
    title: "Reading progress",
    description: "Per-article scroll progress bar and active TOC highlighting.",
  },
  {
    icon: Command,
    title: "Keyboard-first",
    description: "⌘K to search anywhere. Built for people who live in the terminal.",
  },
];

export default async function Home() {
  const [notes, navigation, allNotes] = await Promise.all([
    getFeaturedNotes(),
    getNavigationRoot(),
    getPublishedNotes(),
  ]);

  const uniqueTags = new Set(allNotes.flatMap((n) => n.tags));

  return (
    <DocsShell navigation={navigation}>
      <main className="space-y-16">

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-strong)] bg-[var(--surface)] p-8 shadow-[var(--shadow-hero)] sm:p-12">
          {/* Animated mesh background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent-surface),transparent_50%),radial-gradient(ellipse_at_bottom_left,var(--accent-surface),transparent_50%)] opacity-70" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]" />

          {/* Floating mesh gradient decoration */}
          <div className="absolute -right-32 -top-32 h-[400px] w-[400px] animate-float opacity-20 blur-3xl">
            <Image
              src="/images/hero-mesh.png"
              alt=""
              width={400}
              height={400}
              className="animate-rotate-slow"
              priority
            />
          </div>

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <p className="animate-fade-up text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent)]" style={{ animationDelay: "0ms" }}>
                Published from Obsidian · {siteConfig.location}
              </p>
              <h1 className="animate-fade-up max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-7xl" style={{ animationDelay: "100ms" }}>
                <TypewriterHero />
              </h1>
              <p className="animate-fade-up max-w-2xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl" style={{ animationDelay: "200ms" }}>
                {siteConfig.intro}
              </p>
              <div className="animate-fade-up flex flex-col gap-4 sm:flex-row" style={{ animationDelay: "300ms" }}>
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
            <div className="animate-fade-up rounded-[2rem] border border-[var(--border-soft)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]" style={{ animationDelay: "400ms" }}>
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

        {/* ─── STATS ────────────────────────────────────────── */}
        <ScrollReveal>
          <section className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-6 py-8 text-center shadow-[var(--shadow-soft)]">
              <span className="font-serif text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                <AnimatedCounter target={allNotes.length} />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Notes</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-6 py-8 text-center shadow-[var(--shadow-soft)]">
              <span className="font-serif text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                <AnimatedCounter target={allNotes.reduce((acc, n) => acc + n.relatedSlugs.length, 0)} />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Connections</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-6 py-8 text-center shadow-[var(--shadow-soft)]">
              <span className="font-serif text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                <AnimatedCounter target={uniqueTags.size} />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Tags</span>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── NOTE CARDS ───────────────────────────────────── */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note, idx) => (
            <ScrollReveal key={note.slug} delay={idx * 0.08}>
              <Link
                href={`/docs/${note.slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface)] p-7 shadow-[var(--shadow-soft)] transition-all duration-[--motion-base] hover:-translate-y-1.5 hover:border-[var(--accent-border)] hover:bg-[var(--surface-elevated)] hover:shadow-[var(--shadow-hero)]"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent-surface)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60" />
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
            </ScrollReveal>
          ))}
        </section>

        {/* ─── BENTO FEATURE GRID ──────────────────────────── */}
        <ScrollReveal>
          <section className="space-y-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Features</p>
              <h2 className="mt-3 font-serif text-4xl tracking-tight text-[var(--foreground)] sm:text-5xl">Why this garden?</h2>
              <p className="mt-4 mx-auto max-w-2xl text-base leading-relaxed text-[var(--muted)]">
                Everything you need to publish a beautiful knowledge base from Obsidian — fast search, connected graphs, and a premium reading experience.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <ScrollReveal key={feature.title} delay={idx * 0.06}>
                  <div className="group relative overflow-hidden rounded-[1.8rem] border border-[var(--border-strong)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition-all duration-[--motion-base] hover:-translate-y-1 hover:border-[var(--accent-border)] hover:shadow-[var(--shadow-hero)]">
                    {/* Iridescent hover glow */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),var(--accent-surface),transparent_40%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-surface)] text-[var(--accent)]">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-[var(--foreground)]">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{feature.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

      </main>
    </DocsShell>
  );
}
