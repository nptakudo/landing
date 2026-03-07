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
      whileHover={{ y: -1 }}
      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 text-xs font-semibold tracking-[0.08em] text-[var(--muted-strong)] shadow-sm hover:border-[var(--border-strong)]"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <span aria-hidden>{isDark ? "☼" : "☾"}</span>
      {isDark ? "Light" : "Dark"}
    </motion.button>
  );
}
