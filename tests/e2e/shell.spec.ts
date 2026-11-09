import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { installHost } from "../fixtures/telegram";

for (const [width, height] of [
  [390, 844],
  [360, 800],
  [430, 932],
]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(
      "shell " + width + "x" + height + " " + colorScheme,
      async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ colorScheme });
        await installHost(page, { dark: colorScheme === "dark" });
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto("/");
        await expect(page.locator("[data-launch-mode]")).toHaveAttribute(
          "data-launch-mode",
          "telegram",
        );
        await expect(page.locator(".app-shell")).toHaveAttribute(
          "data-shell-theme",
          colorScheme,
        );
        await expect(
          page.getByRole("heading", {
            name: "AI bilan ilk mahsulotingiz",
            level: 2,
          }),
        ).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        const tooSmall = await page
          .locator(".app-shell button, .app-shell a.lg-tab")
          .evaluateAll((elements) =>
            elements
              .filter((element) => {
                const rect = element.getBoundingClientRect();
                return (
                  rect.width > 0 && (rect.width < 43.5 || rect.height < 43.5)
                );
              })
              .map((element) => element.outerHTML.slice(0, 150)),
          );
        expect(tooSmall).toEqual([]);
        expect(errors).toEqual([]);
        if (process.env.CAPTURE_SHELL) {
          await mkdir("docs/screens/step-02", { recursive: true });
          await page.screenshot({
            path:
              "docs/screens/step-02/shell-" +
              width +
              "x" +
              height +
              "-" +
              colorScheme +
              ".png",
            animations: "disabled",
          });
        }
      },
    );
  }
}

test("host theme/insets/viewport events and native bars stay synchronized", async ({
  page,
}) => {
  await installHost(page);
  await page.goto("/");
  await expect(page.locator("[data-launch-mode]")).toHaveAttribute(
    "data-launch-mode",
    "telegram",
  );
  expect(
    await page.evaluate(() =>
      window.__tgFixture!.records.filter((record) =>
        record.startsWith("haptic:"),
      ),
    ),
  ).toEqual([]);
  await page.evaluate(() => {
    const host = window.__tgFixture!;
    host.app.colorScheme = "dark";
    host.emit("themeChanged");
    host.app.safeAreaInset = { top: 24, right: 0, bottom: 34, left: 0 };
    host.app.contentSafeAreaInset = { top: 12, right: 0, bottom: 8, left: 0 };
    host.app.viewportStableHeight = 700;
    host.emit("viewportChanged");
    host.emit("safeAreaChanged");
  });
  await expect(page.locator(".app-shell")).toHaveAttribute(
    "data-shell-theme",
    "dark",
  );
  await expect
    .poll(() =>
      page
        .locator(".app-shell")
        .evaluate((element) =>
          Math.round(element.getBoundingClientRect().height),
        ),
    )
    .toBe(700);
  expect(
    await page
      .locator(".shell-toolbar")
      .evaluate((element) => parseFloat(getComputedStyle(element).paddingTop)),
  ).toBe(36);
  const dock = await page
    .locator(".shell-dock-zone")
    .evaluate((element) => parseFloat(getComputedStyle(element).paddingBottom));
  expect(dock).toBe(54);
  const records = await page.evaluate(() => window.__tgFixture!.records);
  expect(records).toContain("ready");
  expect(records).toContain("expand");
  expect(records).toContain("header:#000000");
  expect(records).toContain("background:#000000");
  expect(records).toContain("bottom:#000000");
  expect(records).not.toContain("fullscreen");
  await page.locator(".shell-scroll").evaluate((element) => {
    element.scrollTop = 500;
  });
  await expect(page.locator(".app-shell")).toHaveAttribute(
    "data-collapsed",
    "true",
  );
});

test("routes, native Back, sheet gesture restoration and haptics preference", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await installHost(page);
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Asosiy navigatsiya" });
  await nav.getByRole("link", { name: "Kurslar", exact: true }).click();
  await expect(page).toHaveURL(/\/courses$/);
  await expect(
    nav.getByRole("link", { name: "Kurslar", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page
    .getByRole("button", { name: "Kurs namunasi", exact: true })
    .click();
  await expect(page).toHaveURL(/\/courses\/ai-basics$/);
  await page.getByRole("button", { name: "Darslarni ko‘rish" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page.evaluate(() => window.__tgFixture!.app.isVerticalSwipesEnabled),
  ).toBe(false);
  await page.evaluate(() => window.__tgFixture!.pressBack());
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(
    await page.evaluate(() => window.__tgFixture!.app.isVerticalSwipesEnabled),
  ).toBe(true);
  await expect(page).toHaveURL(/\/courses\/ai-basics$/);
  await page.evaluate(() => window.__tgFixture!.pressBack());
  await expect(page).toHaveURL(/\/courses$/);
  await nav.getByRole("link", { name: "Profil", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Aziz Karimov" }),
  ).toBeVisible();
  await expect(page.getByText("Profil hali tasdiqlanmagan")).toBeVisible();
  await page.getByRole("button", { name: "Sozlamalarni ochish" }).click();
  await page.getByRole("switch", { name: "Haptics", exact: true }).click();
  const count = await page.evaluate(
    () =>
      window.__tgFixture!.records.filter((record) =>
        record.startsWith("haptic:"),
      ).length,
  );
  await nav.getByRole("link", { name: "Asosiy", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Asosiy", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        window.__tgFixture!.records.filter((record) =>
          record.startsWith("haptic:"),
        ).length,
    ),
  ).toBe(count);
  expect(await page.evaluate(() => window.__tgFixture!.listenerCount())).toBe(
    6,
  );
});

test("direct nested link Back has an in-app fallback and old clients avoid new methods", async ({
  page,
}) => {
  await installHost(page, { version: "6.0" });
  await page.goto("/courses/ai-basics");
  await page.getByRole("button", { name: "Orqaga", exact: true }).click();
  await expect(page).toHaveURL(/\/courses$/);
  expect(await page.evaluate(() => window.__tgFixture!.records)).toEqual([
    "ready",
    "expand",
  ]);
});

test("offline state restores without a reload", async ({ page, context }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "AI bilan ilk mahsulotingiz", level: 2 }),
  ).toBeVisible();
  await context.setOffline(true);
  await expect(
    page.getByRole("heading", { name: "Internet aloqasi yo‘q" }),
  ).toBeVisible();
  if (process.env.CAPTURE_SHELL)
    await page.screenshot({ path: "docs/screens/step-02/offline.png" });
  await context.setOffline(false);
  await expect(
    page.getByRole("heading", { name: "AI bilan ilk mahsulotingiz", level: 2 }),
  ).toBeVisible();
});

test("SDK failure retries without silently becoming a mock", async ({
  page,
}) => {
  let requests = 0;
  await page.route("https://telegram.org/js/telegram-web-app.js", (route) => {
    requests++;
    return route.abort();
  });
  await page.goto("/?tgWebAppData=simulated-launch");
  await expect(
    page.getByRole("heading", {
      name: "Telegram bilan ulanish amalga oshmadi",
    }),
  ).toBeVisible();
  await expect(page.locator("[data-launch-mode]")).toHaveAttribute(
    "data-launch-mode",
    "error",
  );
  await page.getByRole("button", { name: "Qayta ulanish" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Telegram bilan ulanish amalga oshmadi",
    }),
  ).toBeVisible();
  expect(requests).toBe(2);
  await expect(
    page.getByText("DEV · Namuna Telegram profili"),
  ).not.toBeVisible();
});

test("production QA route is unavailable, motion preference and legal stubs remain usable", async ({
  page,
}) => {
  const response = await page.goto("/dev/shell-qa");
  expect([200, 404]).toContain(response?.status());
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(
    page.getByRole("heading", { name: "404", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Xato holatini sinash" }),
  ).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/profile");
  await page.getByRole("button", { name: "Maxfiylik", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Maxfiylik siyosati tayyorlanmoqda" }),
  ).toBeVisible();
  expect(
    await page
      .locator('.route-frame:not([aria-hidden="true"])')
      .evaluate((element) => getComputedStyle(element).transform),
  ).toBe("none");
});
