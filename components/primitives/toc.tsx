import Link from "next/link";

export type TocHeading = {
  id: string;
  text: string;
  depth: number;
};

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="surface-card rounded-2xl p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--muted)]">
        On this page
      </h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className="block rounded-md px-2 py-1 text-sm text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
              style={{ paddingLeft: `${(heading.depth - 2) * 10}px` }}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
