import Link from "next/link";
import { ThemeSwitcher } from "@/components/primitives/theme-switcher";
import { CommandDialog } from "@/components/primitives/command-dialog";

type SearchItem = {
  title: string;
  href: string;
  description?: string;
};

export function TopNav({
  items,
  stats = { notes: 0, tags: 0 },
}: {
  items: SearchItem[];
  stats?: { notes: number; tags: number };
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background-elevated),transparent_18%)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 font-serif text-lg font-semibold tracking-tight shadow-sm hover:border-[var(--border-strong)]"
          >
            Takudo Notes
          </Link>
          <nav className="hidden items-center gap-1.5 text-sm text-[var(--muted)] md:flex">
            <Link
              href="/docs"
              className="rounded-full px-3 py-1 hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
            >
              Docs
            </Link>
            <Link
              href="/graph"
              className="rounded-full px-3 py-1 hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
            >
              Graph
            </Link>
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">
              {stats.notes} notes
            </span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">
              {stats.tags} tags
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          <CommandDialog items={items} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
