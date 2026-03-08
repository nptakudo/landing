"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav, type SearchItem } from "@/components/layout/top-nav";
import type { NavNode } from "@/lib/content/navigation";
import { cn } from "@/lib/utils";

export function ShellFrame({
  children,
  navNodes,
  searchItems,
  stats,
}: {
  children: React.ReactNode;
  navNodes: NavNode[];
  searchItems: SearchItem[];
  stats: { notes: number; tags: number };
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isDocsShell = pathname === "/docs" || pathname.startsWith("/docs/");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <TopNav
        items={searchItems}
        stats={stats}
        variant={isDocsShell ? "docs" : "landing"}
        onOpenDocsNav={isDocsShell ? () => setMobileSidebarOpen(true) : undefined}
        actionLinks={
          isDocsShell
            ? [
                { href: "/", label: "Home", tone: "subtle" },
                { href: "/docs", label: "Overview", tone: "primary" },
              ]
            : [{ href: "/docs", label: "Open docs", tone: "primary" }]
        }
      />

      <div
        className={cn(
          "mx-auto w-full px-4 pb-12 pt-7 sm:px-6",
          isDocsShell ? "max-w-[1400px] lg:grid lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-6" : "max-w-[1160px]",
        )}
      >
        {isDocsShell ? (
          <Sidebar
            nodes={navNodes}
            variant="docs"
            density="compact"
            stickyOffset={76}
            mobileOpen={mobileSidebarOpen}
            onMobileOpenChange={setMobileSidebarOpen}
          />
        ) : null}

        <main
          className={cn(
            "w-full",
            isDocsShell ? "min-w-0" : "mx-auto max-w-[1020px]",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
