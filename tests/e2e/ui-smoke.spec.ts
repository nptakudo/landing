import { expect, test } from "@playwright/test";

test("core routes render and are screenshotable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /published obsidian notes/i })).toBeVisible();
  await page.screenshot({ path: "test-results/ui-home.png", fullPage: true });

  await page.goto("/docs");
  await expect(page.getByRole("heading", { name: /docs index/i })).toBeVisible();
  await page.screenshot({ path: "test-results/ui-docs.png", fullPage: true });

  const noteLink = page.locator('main a[href^="/docs/"]').first();
  await expect(noteLink).toBeVisible();
  await noteLink.click();
  await expect(page).toHaveURL(/\/docs\/.+/);
  await page.screenshot({ path: "test-results/ui-note.png", fullPage: true });

  const firstTagLink = page.locator('a[href^="/tags/"]').first();
  if ((await firstTagLink.count()) > 0) {
    await firstTagLink.click();
    await expect(page).toHaveURL(/\/tags\/.+/);
    await page.screenshot({ path: "test-results/ui-tag.png", fullPage: true });
  }

  await page.goto("/graph");
  await expect(page.getByRole("heading", { name: /link topology/i })).toBeVisible();
  await page.screenshot({ path: "test-results/ui-graph.png", fullPage: true });
});
