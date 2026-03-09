import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
        404
      </p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight text-[var(--foreground)]">
        This note does not exist.
      </h1>
      <p className="mt-4 text-base leading-8 text-[var(--muted)]">
        Try browsing the docs explorer, opening the graph view, or searching from the top bar.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/docs"
          className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)]"
        >
          Browse docs
        </Link>
        <Link
          href="/graph"
          className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-5 py-3 text-sm font-semibold text-[var(--foreground)]"
        >
          View graph
        </Link>
      </div>
    </main>
  );
}
