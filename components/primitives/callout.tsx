import { cn } from "@/lib/utils";

export function Callout({
  title,
  children,
  tone = "note",
}: {
  title?: string;
  children: React.ReactNode;
  tone?: "note" | "tip" | "warning";
}) {
  const toneClass = {
    note: "border-sky-500/40 bg-sky-500/8",
    tip: "border-emerald-500/40 bg-emerald-500/8",
    warning: "border-amber-500/40 bg-amber-500/8",
  }[tone];

  return (
    <aside className={cn("rounded-xl border p-4", toneClass)}>
      {title ? <h4 className="mb-2 text-sm font-semibold">{title}</h4> : null}
      <div className="text-sm leading-7 text-[var(--muted)]">{children}</div>
    </aside>
  );
}
