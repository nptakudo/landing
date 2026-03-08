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
    <nav aria-label="Outline" className="space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
        On this page
      </p>
      <div className="flex flex-col gap-px border-l border-[var(--border-strong)] ml-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isDeep = item.depth >= 3;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={[
                "block rounded-r-lg py-1.5 text-[13px] transition-all duration-[--motion-fast] -ml-px",
                isDeep ? "pl-[22px]" : "pl-4",
                isActive
                  ? `border-l-2 border-[var(--accent)] bg-[var(--accent-surface)] text-[var(--foreground)] font-medium ${isDeep ? 'pl-[calc(22px-1px)]' : 'pl-[calc(16px-1px)]'}`
                  : "border-l-2 border-transparent text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]",
              ].join(" ")}
            >
              {item.text}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
