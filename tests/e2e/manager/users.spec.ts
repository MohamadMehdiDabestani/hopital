import { test, expect } from "@playwright/test";

test.describe("Manager Page - Complete E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/manager");
  });

  test("renders users grid", async ({ page }) => {
    await expect(page.getByTestId("usersGrid")).toBeVisible();
    await expect(page.getByText("جدول کاربران")).toBeVisible();
  });

  test("opens add user dialog", async ({ page }) => {
    await page.getByTestId("openUserDialog").click();

    const dialog = page.getByTestId("userDialog");

    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("افزودن کاربر");
  });

  test("empty add user form", async ({ page }) => {
    await page.getByTestId("openUserDialog").click();

    const dialog = page.getByTestId("userDialog");

    await page.getByTestId("saveUserButton").click();

    await expect(dialog).toContainText("نام را وارد کنید");
  });

  test("close add user dialog", async ({ page }) => {
    await page.getByTestId("openUserDialog").click();

    await page.getByTestId("closeDialogButton").click();

    await expect(page.getByTestId("userDialog")).not.toBeVisible();
  });

  test("validation for phone number", async ({ page }) => {
    await page.getByTestId("openUserDialog").click();

    await page.getByTestId("firstName").fill("علی");
    await page.getByTestId("lastName").fill("محمدی");
    await page.getByTestId("codeMeli").fill("1234567890");

    await page.getByTestId("phone").fill("0912");

    await page.getByTestId("saveUserButton").click();

    await expect(page.getByText("شماره موبایل باید دقیقاً 11 رقم باشد")).toBeVisible();
  });

  test("validation for code meli", async ({ page }) => {
    await page.getByTestId("openUserDialog").click();

    await page.getByTestId("firstName").fill("علی");
    await page.getByTestId("lastName").fill("محمدی");
    await page.getByTestId("phone").fill("09123456789");

    await page.getByTestId("codeMeli").fill("123");

    await page.getByTestId("saveUserButton").click();

    await expect(page.getByText("کد ملی باید دقیقاً 10 رقم باشد")).toBeVisible();
  });

  test("create user successfully", async ({ page }) => {
    await page.getByTestId("openUserDialog").click();

    await page.getByTestId("firstName").fill("کاربر");
    await page.getByTestId("lastName").fill("تست");
    await page.getByTestId("codeMeli").fill("1234567890");
    await page.getByTestId("phone").fill("09123456789");
  // باز کردن select
  await page.getByTestId("role").click();

  // صبر برای باز شدن listbox
  const listbox = page.getByRole("listbox");
  await expect(listbox).toBeVisible();

  // انتخاب گزینه
  await listbox.getByText("دکتر").click();

    await page.getByTestId("saveUserButton").click();

    await expect(page.getByTestId("userDialog")).not.toBeVisible();
  });

  test("toggle date type", async ({ page }) => {
    await page.getByRole("button", { name: "میلادی" }).click();

    await expect(page.getByRole("button", { name: "میلادی" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.getByRole("button", { name: "شمسی" }).click();

    await expect(page.getByRole("button", { name: "شمسی" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("search users in grid", async ({ page }) => {
    const searchInput = page.getByPlaceholder("نام | کد ملی | شماره تماس");

    await searchInput.fill("علی");

    await page.waitForTimeout(500);

    await expect(page.getByTestId("usersGrid")).toBeVisible();
  });

  test("open reset password menu", async ({ page }) => {
    const resetButton = page.locator('[aria-label="reset-password"]').first();

    if (await resetButton.isVisible()) {
      await resetButton.click();

      await expect(page.getByTestId("resetMenu")).toBeVisible();
    }
  });

  test("reset password with code meli", async ({ page }) => {
    const resetButton = page.locator('[aria-label="reset-password"]').first();

    if (await resetButton.isVisible()) {
      await resetButton.click();

      await page.getByTestId("resetCodeMeli").click();
    }
  });
});
