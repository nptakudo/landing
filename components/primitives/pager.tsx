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
          className="surface-card rounded-xl p-4 text-sm hover:border-[var(--border-strong)]"
        >
          <p className="text-xs uppercase tracking-[0.13em] text-[var(--muted)]">Previous</p>
          <p className="mt-1 font-semibold">{prev.label}</p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="surface-card rounded-xl p-4 text-right text-sm hover:border-[var(--border-strong)]"
        >
          <p className="text-xs uppercase tracking-[0.13em] text-[var(--muted)]">Next</p>
          <p className="mt-1 font-semibold">{next.label}</p>
        </Link>
      ) : null}
    </div>
  );
}
