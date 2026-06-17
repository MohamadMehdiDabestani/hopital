import { test, expect } from "@playwright/test";

test("dashboard page loads", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page.getByText("e2e test user")).toBeVisible();
});