import { test, expect } from "@playwright/test";

test.describe("Login Form Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders form", async ({ page }) => {
    await expect(page.getByTestId("phone")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.getByTestId("login-submit")).toBeVisible();
  });

  test("shows required field errors on empty submit", async ({ page }) => {
    await page.getByTestId("login-submit").click();

    await expect(page.getByText("شماره موبایل الزامی است")).toBeVisible();
    await expect(page.getByText("رمز عبور الزامی است")).toBeVisible();
  });

  test("shows invalid phone error", async ({ page }) => {
    await page.getByTestId("phone").fill("0912");
    await page.getByTestId("password").fill("12345678");
    await page.getByTestId("login-submit").click();

    await expect(
      page.getByText("شماره همراه باید دقیقاً 11 رقم باشد"),
    ).toBeVisible();
  });

  test("shows short password error", async ({ page }) => {
    await page.getByTestId("phone").fill("09123456789");
    await page.getByTestId("password").fill("1234");
    await page.getByTestId("login-submit").click();

    await expect(
      page.getByText("رمز عبور باید حداقل 8 کاراکتر باشد"),
    ).toBeVisible();
  });
});
