import path from "node:path";
import { access } from "node:fs/promises";

export const mirroredContentRoot = path.join(process.cwd(), "content", "notes");
export const exampleContentRoot = path.join(process.cwd(), "content", "example");

async function exists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function resolveContentRoot() {
  if (await exists(mirroredContentRoot)) {
    return mirroredContentRoot;
  }

  return exampleContentRoot;
}
