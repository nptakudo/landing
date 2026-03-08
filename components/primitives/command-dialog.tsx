"use client";

import { Dialog } from "@base-ui/react/dialog";
import MiniSearch from "minisearch";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SearchIndexEntry } from "@/lib/search/types";
import { cn } from "@/lib/utils";

type SearchItem = {
  title: string;
  href: string;
  description?: string;
};

type SearchPayload = {
  generatedAt: string;
  entries: SearchIndexEntry[];
};

export function CommandDialog({
  items,
  variant = "landing",
}: {
  items: SearchItem[];
  variant?: "landing" | "docs";
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState<MiniSearch<SearchIndexEntry> | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open || searchIndex) {
      return;
    }

    let mounted = true;

    async function loadIndex() {
      try {
        const response = await fetch("/search-index.json");
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as SearchPayload;
        const mini = new MiniSearch<SearchIndexEntry>({
          fields: ["title", "aliases", "tags", "headings", "body"],
          storeFields: ["slug", "title", "body"],
          searchOptions: {
            boost: { title: 4, aliases: 3, tags: 2, headings: 2 },
            prefix: true,
            fuzzy: 0.15,
          },
        });

        mini.addAll(payload.entries);

        if (mounted) {
          setSearchIndex(mini);
        }
      } catch {
        // Fallback behavior uses prop-provided items.
      }
    }

    loadIndex();

    return () => {
      mounted = false;
    };
  }, [open, searchIndex]);

  const filtered = useMemo(() => {
    const normalized = query.trim();

    if (!normalized) {
      return items.slice(0, 8);
    }

    if (searchIndex) {
      return searchIndex
        .search(normalized)
        .slice(0, 8)
        .map((result) => ({
          title: result.title,
          href: `/docs/${result.slug}`,
          description: result.body.slice(0, 120),
        }));
    }

    return items
      .filter((item) => {
        const haystack = `${item.title} ${item.description ?? ""}`.toLowerCase();
        return haystack.includes(normalized.toLowerCase());
      })
      .slice(0, 8);
  }, [items, query, searchIndex]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={cn(
          "inline-flex h-9 items-center gap-2 border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-xs font-semibold text-[var(--muted-strong)] shadow-sm hover:border-[var(--border-strong)]",
          variant === "docs" ? "min-w-[168px] rounded-lg justify-between" : "rounded-full",
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          {variant === "docs" ? "Search docs..." : "Search"}
        </span>
        <span className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-0.5 text-[0.62rem]">
          ⌘K
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/32 backdrop-blur-sm" />
        <Dialog.Popup className="fixed inset-0 z-50 grid place-items-start p-4 pt-16 sm:p-6 sm:pt-20">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8, scale: 0.99 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]"
          >
            <Dialog.Title className="text-sm font-semibold tracking-wide text-[var(--muted)]">
              Search notes
            </Dialog.Title>
            <input
              className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5 text-sm text-[var(--text-strong)] outline-none ring-[var(--ring)] focus:ring-2"
              placeholder="Search title, aliases, tags, headings, body"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <ul className="mt-3 max-h-72 space-y-1.5 overflow-y-auto">
              {filtered.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg border border-transparent px-3 py-2.5 hover:border-[var(--border)] hover:bg-[var(--surface-muted)]"
                  >
                    <p className="text-sm font-semibold text-[var(--text-strong)]">{item.title}</p>
                    {item.description ? (
                      <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{item.description}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-sm text-[var(--muted)]">No results</li>
              ) : null}
            </ul>
          </motion.div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
