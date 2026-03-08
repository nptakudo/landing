"use client";

import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({
  variant = "landing",
}: {
  variant?: "landing" | "docs";
}) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold tracking-[0.06em]",
        "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--muted-strong)] hover:border-[var(--border-strong)]",
        variant === "landing" && "rounded-full",
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <span aria-hidden>{isDark ? "☼" : "☾"}</span>
      {isDark ? "Light" : "Dark"}
    </motion.button>
  );
}
