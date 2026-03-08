"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/content";

export function OutlineNav({ items }: { items: TocEntry[] }) {
  const [observedActiveId, setObservedActiveId] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    if (items.length === 0 || typeof window === "undefined") {
      return;
    }

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

        if (visibleHeadings[0]?.target.id) {
          setObservedActiveId(visibleHeadings[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.5, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  const activeId = items.some((item) => item.id === observedActiveId)
    ? observedActiveId
    : items[0]?.id;

  return (
    <nav aria-label="Outline" className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Outline
      </p>
      <div className="space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={[
              "block rounded-2xl px-3 py-2 text-sm transition",
              item.depth >= 3 ? "ml-4" : "",
              activeId === item.id
                ? "bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]",
            ].join(" ")}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
