import { cn } from "@/lib/utils/cn";

export function KbdBadge({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <kbd
            className={cn(
                "inline-flex items-center justify-center rounded border border-[var(--border-strong)] bg-[var(--panel)] px-1.5 py-0.5 text-[10px] font-mono font-medium text-[var(--muted)] shadow-sm",
                className,
            )}
        >
            {children}
        </kbd>
    );
}
