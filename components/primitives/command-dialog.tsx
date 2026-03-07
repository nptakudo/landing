"use client";

import { Dialog } from "@base-ui/react/dialog";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import Link from "next/link";

type SearchItem = {
  title: string;
  href: string;
  description?: string;
};

export function CommandDialog({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, 8);
    }

    const normalized = query.toLowerCase();
    return items
      .filter((item) => item.title.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [items, query]);

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
              placeholder="Search by title"
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
                      <p className="mt-1 text-xs text-[var(--muted)]">{item.description}</p>
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
