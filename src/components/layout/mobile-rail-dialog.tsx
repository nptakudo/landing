"use client";

import { Dialog } from "@base-ui/react/dialog";
import { motion, useReducedMotion } from "motion/react";
import { PanelLeftOpen, ListTree } from "lucide-react";

export function MobileRailDialog({
  title,
  children,
  side,
}: {
  title: string;
  children: React.ReactNode;
  side: "left" | "right";
}) {
  const prefersReducedMotion = useReducedMotion();
  const Icon = side === "left" ? PanelLeftOpen : ListTree;

  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm text-[var(--foreground)] shadow-[var(--shadow-soft)] xl:hidden">
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[rgba(9,13,20,0.45)] backdrop-blur-md" />
        <Dialog.Popup
          className={`fixed ${side === "left" ? "left-0" : "right-0"} top-0 z-50 h-full w-[min(88vw,22rem)] p-4`}
        >
          <motion.div
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, x: side === "left" ? -18 : 18 }
            }
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex h-full flex-col rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-hero)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="font-serif text-2xl tracking-tight text-[var(--foreground)]">
                {title}
              </Dialog.Title>
              <Dialog.Close className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Close
              </Dialog.Close>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
