import Link from "next/link";

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted)]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {isLast || !item.href ? (
                <span className="font-medium text-[var(--text)]">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-md px-1.5 py-0.5 hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                >
                  {item.label}
                </Link>
              )}
              {!isLast ? <span className="text-[var(--border-strong)]">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
