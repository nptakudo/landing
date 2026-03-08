import Link from "next/link";
import { CommandDialog } from "@/components/primitives/command-dialog";
import { ThemeSwitcher } from "@/components/primitives/theme-switcher";
import { cn } from "@/lib/utils";

export type SearchItem = {
  title: string;
  href: string;
  description?: string;
};

export type TopNavVariant = "landing" | "docs";

export type TopNavLink = {
  href: string;
  label: string;
};

export type TopNavActionLink = {
  href: string;
  label: string;
  tone?: "subtle" | "primary";
};

export function TopNav({
  items,
  variant = "landing",
  stats = { notes: 0, tags: 0 },
  navLinks,
  actionLinks,
  onOpenDocsNav,
}: {
  items: SearchItem[];
  variant?: TopNavVariant;
  stats?: { notes: number; tags: number };
  navLinks?: TopNavLink[];
  actionLinks?: TopNavActionLink[];
  onOpenDocsNav?: () => void;
}) {
  const resolvedNavLinks =
    navLinks ??
    (variant === "landing"
      ? [
          { href: "/docs", label: "Docs" },
          { href: "/graph", label: "Graph" },
        ]
      : []);

  const resolvedActionLinks =
    actionLinks ??
    (variant === "docs"
      ? [{ href: "/", label: "Back to home", tone: "subtle" as const }]
      : []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface),transparent_3%)]",
        "supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--surface),transparent_16%)] supports-[backdrop-filter]:backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full items-center gap-3 px-4 py-3 sm:px-6",
          variant === "docs" ? "max-w-[1400px]" : "max-w-[1160px]",
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
          {variant === "docs" ? (
            <>
              {onOpenDocsNav ? (
                <button
                  type="button"
                  onClick={onOpenDocsNav}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-sm text-[var(--muted-strong)] hover:border-[var(--border-strong)] lg:hidden"
                  aria-label="Open docs navigation"
                >
                  ☰
                </button>
              ) : null}
              <Link
                href="/docs"
                className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-sm font-semibold text-[var(--text-strong)] hover:border-[var(--border-strong)]"
              >
                Takudo Docs
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-1.5 text-base font-semibold text-[var(--text-strong)] hover:border-[var(--border-strong)]"
            >
              Takudo Notes
            </Link>
          )}

          {resolvedNavLinks.length > 0 ? (
            <nav className="hidden items-center gap-1.5 text-sm text-[var(--muted)] md:flex">
              {resolvedNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-1 hover:bg-[var(--surface-muted)] hover:text-[var(--text-strong)]"
                >
                  {link.label}
                </Link>
              ))}
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs">
                {stats.notes} notes
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs">
                {stats.tags} tags
              </span>
            </nav>
          ) : null}
        </div>

        <div
          className={cn(
            "ml-auto flex items-center gap-2",
            variant === "docs" ? "sm:mr-2" : "",
          )}
        >
          <CommandDialog items={items} variant={variant} />
          {resolvedActionLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "hidden rounded-lg px-3 py-1.5 text-xs font-semibold tracking-[0.04em] sm:inline-flex",
                link.tone === "primary"
                  ? "border border-[var(--brand)] bg-[var(--brand)] text-white hover:bg-[color-mix(in_oklab,var(--brand),black_8%)]"
                  : "border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-strong)] hover:border-[var(--border-strong)]",
              )}
            >
              {link.label}
            </Link>
          ))}
          <ThemeSwitcher variant={variant} />
        </div>
      </div>
    </header>
  );
}
