import { test, expect } from "@playwright/test";

test.describe("Login Page - Complete E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders login page correctly", async ({ page }) => {
    await expect(page.getByText("ورود به سامانه")).toBeVisible();
    await expect(
      page.getByText("اطلاعات کاربری خود را وارد کنید"),
    ).toBeVisible();

    await expect(page.getByTestId("phone")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.getByTestId("login-submit")).toBeVisible();

    await expect(page.getByText("حساب ندارید؟")).toBeVisible();
    await expect(page.getByText("فراموشی رمز؟")).toBeVisible();
  });

  test("shows validation errors when submitting empty form", async ({
    page,
  }) => {
    await page.getByTestId("login-submit").click();

    await expect(page.getByText("شماره موبایل الزامی است")).toBeVisible();
    await expect(page.getByText("رمز عبور الزامی است")).toBeVisible();
  });

  test("shows error for invalid phone number", async ({ page }) => {
    await page.getByTestId("phone").fill("0912");
    await page.getByTestId("password").fill("12345678");
    await page.getByTestId("login-submit").click();

    await expect(
      page.getByText("شماره همراه باید دقیقاً 11 رقم باشد"),
    ).toBeVisible();
  });

  test("shows error for short password", async ({ page }) => {
    await page.getByTestId("phone").fill("09123456789");
    await page.getByTestId("password").fill("1234");
    await page.getByTestId("login-submit").click();

    await expect(
      page.getByText("رمز عبور باید حداقل 8 کاراکتر باشد"),
    ).toBeVisible();
  });


  test("toggles password visibility", async ({ page }) => {
    const passwordInput = page.getByTestId("password");

    await passwordInput.fill("12345678");
    await expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = page.getByTestId("toggle-password");

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });


  test("redirects to dashboard on successful login", async ({ page }) => {
    await page
      .getByTestId("phone")
      .fill(process.env.E2E_USER_PHONE || "09135377506");
    await page
      .getByTestId("password")
      .fill(process.env.E2E_USER_PASSWORD || "123456789");

    await page.getByTestId("login-submit").click();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("shows error notification when login fails", async ({ page }) => {
    await page.getByTestId("phone").fill("09135333333");
    await page.getByTestId("password").fill("wrongpassword");

    await page.getByTestId("login-submit").click();

    const alert = page
      .getByRole("alert")
      .filter({ hasText: "کاربری یافت نشد" });

    await expect(alert).toBeVisible();
    await expect(alert).toContainText("کاربری یافت نشد");
  });
});
