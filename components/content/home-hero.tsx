"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

type HomeHeroProps = {
  notesCount: number;
};

export function HomeHero({ notesCount }: HomeHeroProps) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="surface-card relative isolate overflow-hidden rounded-3xl p-8 sm:p-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 z-0 h-56 w-56 rounded-full bg-[color-mix(in_oklab,var(--accent-soft),transparent_22%)] opacity-65 blur-2xl"
      />
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Personal Knowledge Base
        </p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          Published Obsidian notes with strong structure, linked context, and fast retrieval.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
          Local-first writing workflow. Static deploy output. Currently indexing{" "}
          <strong className="text-[var(--text)]">{notesCount}</strong> published notes.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/docs"
            className="rounded-full bg-[var(--text)] px-4 py-2.5 text-sm font-semibold text-[var(--background)] hover:translate-y-[-1px]"
          >
            Browse notes
          </Link>
          <Link
            href="/graph"
            className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--border-strong)]"
          >
            View graph
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
