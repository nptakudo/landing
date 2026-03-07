import Link from "next/link";
import { ThemeSwitcher } from "@/components/primitives/theme-switcher";
import { CommandDialog } from "@/components/primitives/command-dialog";

type SearchItem = {
  title: string;
  href: string;
  description?: string;
};

export function TopNav({ items }: { items: SearchItem[] }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background),transparent_8%)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
          Takudo Notes
        </Link>
        <div className="flex items-center gap-2">
          <CommandDialog items={items} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
