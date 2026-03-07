"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SimpleTabs } from "@/components/primitives/tabs";

export default function Home() {
  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Personal Knowledge Base
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          Notes published from Obsidian with structure, search, and backlinks.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
          This site is generated from local markdown notes. Content parsing,
          wikilinks, tags, and search index generation happen at build time.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/docs"
            className="rounded-full bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--background)]"
          >
            Browse notes
          </Link>
          <Link
            href="/graph"
            className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold"
          >
            View graph
          </Link>
        </div>
      </motion.section>

      <SimpleTabs
        defaultValue="recent"
        tabs={[
          {
            value: "recent",
            label: "Recent",
            content: (
              <p className="text-sm text-[var(--muted)]">
                Recent notes will appear here once content sync is enabled.
              </p>
            ),
          },
          {
            value: "tags",
            label: "Tags",
            content: (
              <p className="text-sm text-[var(--muted)]">
                Tag cloud is generated from published notes.
              </p>
            ),
          },
          {
            value: "backlinks",
            label: "Backlinks",
            content: (
              <p className="text-sm text-[var(--muted)]">
                Backlinks are computed from resolved wikilinks.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}
