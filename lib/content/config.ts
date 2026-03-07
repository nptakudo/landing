import path from "node:path";

export const contentConfig = {
  notesDir: path.join(process.cwd(), "content", "notes"),
  fallbackNotesDir: path.join(process.cwd(), "content", "example"),
  assetsPublicDir: path.join(process.cwd(), "public", "obsidian-assets"),
};
