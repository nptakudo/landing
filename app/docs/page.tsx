import Link from "next/link";

export default function DocsIndexPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-serif text-3xl">Docs index</h1>
      <p className="text-[var(--muted)]">
        Content pages are generated from synchronized Obsidian notes.
      </p>
      <Link
        href="/"
        className="inline-flex rounded-full border border-[var(--border)] px-3 py-1 text-sm"
      >
        Back home
      </Link>
    </section>
  );
}
