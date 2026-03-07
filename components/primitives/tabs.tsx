"use client";

import { Tabs } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

export function SimpleTabs({
  tabs,
  defaultValue,
}: {
  tabs: TabItem[];
  defaultValue: string;
}) {
  return (
    <Tabs.Root defaultValue={defaultValue} className="space-y-4">
      <Tabs.List className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1">
        {tabs.map((tab) => (
          <Tabs.Tab
            key={tab.value}
            value={tab.value}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold text-[var(--muted)]",
              "data-[selected]:bg-[var(--text)] data-[selected]:text-[var(--background)]",
            )}
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Panel
          key={tab.value}
          value={tab.value}
          className="surface-card rounded-2xl p-5"
        >
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
