import { MobileRailDialog } from "@/components/layout/mobile-rail-dialog";
import { SidebarTree } from "@/components/navigation/sidebar-tree";
import { OutlineNav } from "@/components/note/outline-nav";
import type { NavigationTreeNode, TocEntry } from "@/lib/content";

export function DocsShell({
  children,
  navigation,
  outline,
  activeHref,
}: {
  children: React.ReactNode;
  navigation: NavigationTreeNode;
  outline?: TocEntry[];
  activeHref?: string;
}) {
  return (
    <div className="mx-auto grid w-full max-w-[1500px] gap-8 px-5 pb-16 pt-8 sm:px-8 xl:grid-cols-[292px_minmax(0,1fr)_244px]">
      <div className="col-span-full flex flex-wrap gap-3 xl:hidden">
        <MobileRailDialog title="Files" side="left">
          <SidebarTree tree={navigation} activeHref={activeHref} />
        </MobileRailDialog>
        {outline ? (
          <MobileRailDialog title="Outline" side="right">
            <OutlineNav items={outline} />
          </MobileRailDialog>
        ) : null}
      </div>
      <aside className="hidden xl:block">
        <div className="sticky top-28 rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
          <SidebarTree tree={navigation} activeHref={activeHref} />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
      <aside className="hidden xl:block">
        <div className="sticky top-28 rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
          {outline ? (
            <OutlineNav items={outline} />
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Outline and active section tracking will appear here for long-form notes.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
