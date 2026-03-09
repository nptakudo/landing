"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import MiniSearch, { type SearchResult } from "minisearch";
import { motion } from "motion/react";
import { Search, ArrowUpRight } from "lucide-react";
import type { SearchIndexEntry } from "@/lib/content";
import { KbdBadge } from "@/components/primitives/kbd-badge";

type SearchHit = SearchIndexEntry & {
  id: string;
  score: number;
};

function toSearchHit(result: SearchResult): SearchHit {
  return {
    id: `${result.id}`,
    score: result.score,
    slug: `${result.slug}`,
    title: `${result.title}`,
    description: typeof result.description === "string" ? result.description : undefined,
    aliases: Array.isArray(result.aliases) ? result.aliases.map(String) : [],
    tags: Array.isArray(result.tags) ? result.tags.map(String) : [],
    headings: Array.isArray(result.headings) ? result.headings.map(String) : [],
    excerpt: typeof result.excerpt === "string" ? result.excerpt : "",
    body: typeof result.body === "string" ? result.body : "",
  };
}

export function SearchDialog({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchIndexEntry[]>([]);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const miniSearchRef = useRef<MiniSearch<SearchIndexEntry> | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    async function loadIndex() {
      if (!open || miniSearchRef.current || loading) {
        return;
      }

      setLoading(true);

      try {
        const response = await fetch("/search-index.json");
        const data = (await response.json()) as SearchIndexEntry[];
        const index = new MiniSearch<SearchIndexEntry>({
          idField: "slug",
          fields: ["title", "description", "aliases", "tags", "headings", "excerpt", "body"],
          storeFields: ["slug", "title", "description", "aliases", "tags", "headings", "excerpt", "body"],
          searchOptions: {
            boost: { title: 6, aliases: 4, tags: 3, headings: 2 },
            prefix: true,
            fuzzy: 0.15,
          },
        });

        index.addAll(data);
        miniSearchRef.current = index;
        setEntries(data);
        startTransition(() => {
          setHits(
            data.slice(0, 6).map((entry, indexPosition) => ({
              ...entry,
              id: entry.slug,
              score: 6 - indexPosition,
            })),
          );
        });
      } finally {
        setLoading(false);
      }
    }

    void loadIndex();
  }, [loading, open]);

  useEffect(() => {
    const index = miniSearchRef.current;
    if (!index) {
      return;
    }

    if (!query.trim()) {
      startTransition(() => {
        setHits(
          entries.slice(0, 6).map((entry, indexPosition) => ({
            ...entry,
            id: entry.slug,
            score: 6 - indexPosition,
          })),
        );
      });
      return;
    }

    const results = index.search(query).slice(0, 8).map(toSearchHit);
    startTransition(() => {
      setHits(results);
    });
  }, [entries, query]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex h-11 items-center gap-3 rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 text-sm text-[var(--muted)] transition hover:border-[var(--foreground)] hover:text-[var(--foreground)]">
        <Search className="h-4 w-4" />
        <span>{compact ? "Search" : "Search notes"}</span>
        {!compact ? <KbdBadge>⌘K</KbdBadge> : null}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[rgba(9,13,20,0.45)] backdrop-blur-md" />
        <Dialog.Popup className="fixed inset-0 z-50 grid place-items-start px-4 pt-24 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-hero)]"
          >
            <div className="border-b border-[var(--border-soft)] p-4">
              <div className="flex items-center gap-3 rounded-[1.2rem] bg-[var(--panel)] px-4 py-3">
                <Search className="h-4 w-4 text-[var(--muted)]" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search titles, tags, headings, and note content"
                  className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                />
              </div>
            </div>
            <div className="max-h-[32rem] overflow-y-auto p-4">
              {loading ? (
                <p className="px-2 py-8 text-sm text-[var(--muted)]">Loading search index…</p>
              ) : hits.length === 0 ? (
                <p className="px-2 py-8 text-sm text-[var(--muted)]">No notes matched that query.</p>
              ) : (
                <div className="space-y-2">
                  {hits.map((hit) => (
                    <a
                      key={hit.id}
                      href={`/docs/${hit.slug}`}
                      className="block rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-4 transition hover:border-[var(--border-strong)]"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-serif text-2xl tracking-tight text-[var(--foreground)]">
                            {hit.title}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                            {hit.description ?? hit.excerpt}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {hit.tags.slice(0, 4).map((tag) => (
                              <span
                                key={`${hit.slug}-${tag}`}
                                className="rounded-full border border-[var(--border-soft)] px-2.5 py-1 text-xs text-[var(--muted)]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ArrowUpRight className="mt-1 h-4 w-4 text-[var(--muted)]" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root >
  );
}
