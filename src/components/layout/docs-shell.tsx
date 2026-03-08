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
    <div className="mx-auto grid w-full max-w-[1500px] gap-8 px-5 pb-16 sm:px-8 xl:grid-cols-[280px_minmax(0,1fr)_260px]">
      <div className="col-span-full flex flex-wrap gap-3 pt-8 xl:hidden">
        <MobileRailDialog title="Files" side="left">
          <SidebarTree tree={navigation} activeHref={activeHref} />
        </MobileRailDialog>
        {outline ? (
          <MobileRailDialog title="Outline" side="right">
            <OutlineNav items={outline} />
          </MobileRailDialog>
        ) : null}
      </div>
      <aside className="hidden xl:block border-r border-[var(--border-soft)] pr-6">
        <div className="sticky top-[4.5rem] h-[calc(100vh-4.5rem)] overflow-y-auto py-8 hide-scrollbar">
          <SidebarTree tree={navigation} activeHref={activeHref} />
        </div>
      </aside>
      <div className="min-w-0 pt-8 max-w-[800px] mx-auto w-full">{children}</div>
      <aside className="hidden xl:block border-l border-[var(--border-soft)] pl-6">
        <div className="sticky top-[4.5rem] h-[calc(100vh-4.5rem)] overflow-y-auto py-8 hide-scrollbar">
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
