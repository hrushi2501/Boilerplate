import { expect, test } from "@playwright/test";

test("smoke test - landing page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Pravi AI/);
  await expect(page.locator("h1")).toContainText("Build Fast. Ship Clean.");
});
