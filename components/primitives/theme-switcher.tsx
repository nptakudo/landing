"use client";

import { useTheme } from "next-themes";
import { motion } from "motion/react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      className="inline-flex h-9 items-center rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 text-xs font-semibold tracking-wide text-[var(--text)] transition-colors hover:border-[var(--border-strong)]"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {isDark ? "Light" : "Dark"}
    </motion.button>
  );
}
