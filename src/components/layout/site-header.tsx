"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchDialog } from "@/components/search/search-dialog";
import { ThemeToggle } from "@/components/primitives/theme-toggle";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils/cn";

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname?.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-[--motion-fast]",
        isActive
          ? "bg-[var(--accent-surface)] text-[var(--accent)]"
          : "text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
      )}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[color:var(--surface)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-[1500px] items-center justify-between gap-6 px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--foreground)] font-serif text-lg font-bold text-[var(--background)] transition-colors duration-[--motion-fast] group-hover:bg-[var(--accent)]">
              {siteConfig.author.charAt(0)}
            </div>
            <div className="space-y-0.5 hidden sm:block">
              <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
                {siteConfig.author}
              </span>
              <span className="block font-serif text-lg leading-none tracking-tight text-[var(--foreground)]">
                {siteConfig.title}
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavItem href="/docs">Docs</NavItem>
            <NavItem href="/graph">Graph</NavItem>
            <NavItem href="/tags">Tags</NavItem>
          </nav>
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
