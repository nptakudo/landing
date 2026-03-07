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
    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        On this page
      </h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className="block text-sm text-[var(--muted)] hover:text-[var(--text)]"
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
