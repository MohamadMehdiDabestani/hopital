import { test as setup } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("phone").fill(process.env.E2E_USER_PHONE!);
  await page.getByTestId("password").fill(process.env.E2E_USER_PASSWORD!);

  await Promise.all([
    page.waitForURL(/\/dashboard/),
    page.getByTestId("login-submit").click(),
  ]);

  await page.context().storageState({ path: "playwright/.auth/user.json" });
});
