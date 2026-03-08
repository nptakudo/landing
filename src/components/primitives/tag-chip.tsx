import { cn } from "@/lib/utils/cn";

export function TagChip({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]",
                className,
            )}
        >
            {children}
        </span>
    );
}
