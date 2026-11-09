import { expect, test } from "@playwright/test";
test("actual development mock is labelled and routes stay usable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("[data-launch-mode]")).toHaveAttribute(
    "data-launch-mode",
    "dev-mock",
  );
  await expect(page.getByText("DEV · Namuna Telegram profili")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Asosiy navigatsiya" })
    .getByRole("link", { name: "Profil" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Aziz Karimov" }),
  ).toBeVisible();
  await expect(page.getByText("Namuna profil", { exact: true })).toBeVisible();
});
test("real route error boundary recovers without exposing the exception", async ({
  page,
}) => {
  await page.goto("/dev/shell-qa");
  await page.getByRole("button", { name: "Xato holatini sinash" }).click();
  await expect(
    page.getByRole("heading", { name: "Sahifani ochib bo‘lmadi" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Qayta urinish", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Xato holatini sinash" }),
  ).toBeVisible();
});
