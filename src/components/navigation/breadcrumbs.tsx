import Link from "next/link";

export function Breadcrumbs({
  segments,
  currentLabel,
}: {
  segments: { label: string; href?: string }[];
  currentLabel?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
      <Link href="/" className="transition hover:text-[var(--foreground)]">
        Home
      </Link>
      {segments.map((segment) => (
        <span key={`${segment.label}-${segment.href ?? "current"}`} className="contents">
          <span>/</span>
          {segment.href ? (
            <Link href={segment.href} className="transition hover:text-[var(--foreground)]">
              {segment.label}
            </Link>
          ) : (
            <span>{segment.label}</span>
          )}
        </span>
      ))}
      {currentLabel ? (
        <>
          <span>/</span>
          <span className="text-[var(--foreground)]">{currentLabel}</span>
        </>
      ) : null}
    </nav>
  );
}
