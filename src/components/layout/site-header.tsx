import Link from "next/link";
import { SearchDialog } from "@/components/search/search-dialog";
import { ThemeToggle } from "@/components/primitives/theme-toggle";
import { siteConfig } from "@/site.config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[color:var(--background)/0.82] backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-[1500px] items-center justify-between gap-6 px-5 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="space-y-0.5">
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              {siteConfig.author}
            </span>
            <span className="block font-serif text-lg tracking-tight text-[var(--foreground)]">
              {siteConfig.title}
            </span>
          </Link>
          <div className="hidden items-center gap-4 text-sm text-[var(--muted)] md:flex">
            <Link href="/docs" className="transition hover:text-[var(--foreground)]">
              Docs
            </Link>
            <Link href="/graph" className="transition hover:text-[var(--foreground)]">
              Graph
            </Link>
            <Link href="/tags" className="transition hover:text-[var(--foreground)]">
              Tags
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <SearchDialog compact />
          </div>
          <div className="hidden md:block">
            <SearchDialog />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
