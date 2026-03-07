"use client";

import { Dialog } from "@base-ui/react/dialog";
import MiniSearch from "minisearch";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SearchIndexEntry } from "@/lib/search/types";

type SearchItem = {
  title: string;
  href: string;
  description?: string;
};

type SearchPayload = {
  generatedAt: string;
  entries: SearchIndexEntry[];
};

export function CommandDialog({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState<MiniSearch<SearchIndexEntry> | null>(null);

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
      <Dialog.Trigger className="rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs font-medium text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]">
        Search
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm" />
        <Dialog.Popup className="fixed inset-0 z-50 grid place-items-start p-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-xl"
          >
            <Dialog.Title className="text-sm font-semibold">Search notes</Dialog.Title>
            <input
              className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm outline-none ring-[var(--ring)] focus:ring-2"
              placeholder="Search title, aliases, tags, headings, body"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto">
              {filtered.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg border border-transparent px-3 py-2 hover:border-[var(--border)] hover:bg-[var(--panel)]"
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.description ? (
                      <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
                        {item.description}
                      </p>
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
