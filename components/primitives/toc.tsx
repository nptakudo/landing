import Link from "next/link";
import { cn } from "@/lib/utils";

export type TocHeading = {
  id: string;
  text: string;
  depth: number;
};

export function TableOfContents({
  headings,
  variant = "panel",
}: {
  headings: TocHeading[];
  variant?: "panel" | "inline";
}) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        "rounded-xl border border-[var(--border)]",
        variant === "inline"
          ? "bg-[var(--surface-muted)] px-4 py-4"
          : "bg-[var(--surface)] px-4 py-4 shadow-[var(--shadow-soft)]",
      )}
    >
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        On this page
      </h2>
      <ul className="space-y-1.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className="block rounded-md px-2 py-1 text-sm text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-strong)]"
              style={{ paddingLeft: `${8 + (heading.depth - 2) * 10}px` }}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
