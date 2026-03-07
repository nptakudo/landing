import Link from "next/link";
import { ThemeSwitcher } from "@/components/primitives/theme-switcher";
import { CommandDialog } from "@/components/primitives/command-dialog";

const defaultSearchItems = [
  { title: "Docs index", href: "/docs" },
  { title: "Tags", href: "/tags/all" },
  { title: "Graph", href: "/graph" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background),transparent_8%)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
          Takudo Notes
        </Link>
        <div className="flex items-center gap-2">
          <CommandDialog items={defaultSearchItems} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
