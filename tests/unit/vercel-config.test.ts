import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("vercel deployment config", () => {
  it("pins framework to nextjs", () => {
    const configPath = path.join(process.cwd(), "vercel.json");
    expect(fs.existsSync(configPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(configPath, "utf8")) as {
      framework?: string;
      buildCommand?: string;
      outputDirectory?: string;
    };

    expect(config.framework).toBe("nextjs");
    expect(config.buildCommand).toBe("pnpm build");
    expect(config.outputDirectory).toBeUndefined();
  });
});
