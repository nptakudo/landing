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
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.34 }}
      className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] px-6 py-10 shadow-[var(--shadow-soft)] sm:px-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-[-4.5rem] h-52 w-52 rounded-full bg-[color-mix(in_oklab,var(--brand-soft),transparent_28%)] blur-2xl"
      />
      <div className="relative z-10 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
          Personal docs platform
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.15] tracking-[-0.02em] text-[var(--brand)] sm:text-[3.1rem]">
          Notes for humans and AI, published from your Obsidian vault.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
          Static-first writing workflow with backlinks, tags, and full-text search across
          {" "}
          <strong className="text-[var(--text-strong)]">{notesCount}</strong>
          {" "}
          public notes.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/docs"
            className="inline-flex rounded-md border border-[var(--brand)] bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[color-mix(in_oklab,var(--brand),black_8%)]"
          >
            Browse docs
          </Link>
          <Link
            href="/graph"
            className="inline-flex rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-strong)] hover:border-[var(--border-strong)]"
          >
            Explore graph
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
