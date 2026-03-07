import Link from "next/link";

type PagerLink = {
  href: string;
  label: string;
};

export function Pager({
  prev,
  next,
}: {
  prev?: PagerLink;
  next?: PagerLink;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3 text-sm hover:border-[var(--border-strong)]"
        >
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Prev</p>
          <p className="mt-1 font-medium">{prev.label}</p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3 text-right text-sm hover:border-[var(--border-strong)]"
        >
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Next</p>
          <p className="mt-1 font-medium">{next.label}</p>
        </Link>
      ) : null}
    </div>
  );
}
