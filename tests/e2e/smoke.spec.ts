import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const colorScheme of ["light", "dark"] as const) {
  test(`browser shell renders accessibly in ${colorScheme} mode`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "uz");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("[data-launch-mode]")).toHaveAttribute(
      "data-launch-mode",
      "browser",
    );
    await expect(
      page.getByRole("heading", { name: "O‘rganish shu yerdan boshlanadi." }),
    ).toBeVisible();
    await expect(
      page.getByText("Brauzer ko‘rinishi · Profil uchun Telegram’da oching"),
    ).toBeVisible();
    await expect(
      page.getByText("Aziz Karimov", { exact: true }),
    ).not.toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
