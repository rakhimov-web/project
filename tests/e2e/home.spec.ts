import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { installHost } from "../fixtures/telegram";

for (const [width, height] of [
  [390, 844],
  [360, 800],
  [430, 932],
]) {
  for (const theme of ["light", "dark"] as const) {
    test("Home " + width + "x" + height + " " + theme, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await installHost(page, { dark: theme === "dark" });
      const errors: string[] = [],
        businessRequests: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) => {
        if (new URL(request.url()).pathname.startsWith("/api/"))
          businessRequests.push(request.url());
      });
      await page.goto("/");
      await expect(
        page.getByRole("heading", {
          name: "AI bilan ilk mahsulotingiz",
          level: 2,
        }),
      ).toBeVisible();
      await expect(
        page.getByText("Namuna progress", { exact: true }),
      ).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await page
          .locator(".shell-scroll")
          .evaluate((element) => element.scrollWidth <= element.clientWidth),
      ).toBe(true);
      expect(
        await page.locator(".home-screen button").evaluateAll((elements) =>
          elements
            .filter((element) => {
              const box = element.getBoundingClientRect();
              return box.width < 43.5 || box.height < 43.5;
            })
            .map((element) => element.outerHTML.slice(0, 120)),
        ),
      ).toEqual([]);
      expect(errors).toEqual([]);
      expect(businessRequests).toEqual([]);
      if (process.env.CAPTURE_HOME) {
        await mkdir("docs/screens/step-03a", { recursive: true });
        await page.screenshot({
          path:
            "docs/screens/step-03a/home-" +
            width +
            "x" +
            height +
            "-" +
            theme +
            ".png",
          animations: "disabled",
        });
        if (width === 390) {
          await page
            .getByRole("heading", { name: "Siz uchun kurslar", exact: true })
            .evaluate((element) =>
              element.scrollIntoView({ block: "start", behavior: "instant" }),
            );
          await page.locator(".shell-scroll").evaluate((element) => {
            element.scrollTop -= 32;
          });
          await page.screenshot({
            path: "docs/screens/step-03a/courses-" + theme + ".png",
            animations: "disabled",
          });
          await page
            .getByRole("heading", {
              name: "Bilim amaliyotga aylansin.",
              exact: true,
            })
            .evaluate((element) =>
              element.scrollIntoView({ block: "start", behavior: "instant" }),
            );
          await page.locator(".shell-scroll").evaluate((element) => {
            element.scrollTop -= 32;
          });
          await page.screenshot({
            path: "docs/screens/step-03a/benefits-" + theme + ".png",
            animations: "disabled",
          });
        }
      }
    });
  }
}
test("Glisse categories filter real fixture rails and keep keyboard/haptics", async ({
  page,
}) => {
  await installHost(page);
  await page.goto("/");
  const filter = page.getByRole("radiogroup", { name: "Kurs toifasi" });
  await filter.getByRole("radio", { name: "Barchasi", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(filter.getByRole("radio", { name: "Bepul" })).toBeChecked();
  await expect(
    page.getByRole("status").filter({ hasText: "1 ta kurs" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Dasturlash kurslari" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Prompt yozish san’ati" }),
  ).toBeVisible();
  await filter.getByRole("radio", { name: "Kod", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "2 ta kurs" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        window.__tgFixture!.records.filter(
          (value) => value === "haptic:selection",
        ).length,
    ),
  ).toBeGreaterThanOrEqual(2);
});
test("saved course state and destinations use the data-access boundary", async ({
  page,
}) => {
  await installHost(page);
  await page.goto("/");
  const save = page.getByRole("button", {
    name: "Tavsiya kursini saqlash",
    exact: true,
  });
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByText("Saqlanganlarga qo‘shildi", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Kursni ko‘rish", exact: true })
    .click();
  await expect(page).toHaveURL(/\/courses\/ai-basics$/);
  await page
    .getByRole("navigation", { name: "Asosiy navigatsiya" })
    .getByRole("link", { name: "Asosiy", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Tavsiya kursini saqlash", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", {
      name: "AI bilan ilk mahsulotingiz — Davom etish",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/lessons\/first-lesson$/);
});
test("loading/empty/error static states and retry are usable", async ({
  page,
}) => {
  await page.goto("/?homeState=loading");
  await expect(
    page.getByRole("status").filter({ hasText: "Tavsiya kursi yuklanmoqda" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Kursni ko‘rish" }),
  ).toHaveCount(0);
  await page.goto("/?homeState=empty");
  await expect(
    page.getByRole("heading", { name: "Yangi kurslar tez orada" }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto("/?homeState=error");
  await expect(
    page.getByRole("heading", { name: "Kurslarni yuklab bo‘lmadi" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Qayta urinish", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "AI bilan ilk mahsulotingiz", level: 2 }),
  ).toBeVisible();
});
test("marquee pauses on request and system material/motion preferences", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const pause = page.getByRole("button", {
    name: "Vositalar harakatini to‘xtatish",
    exact: true,
  });
  await pause.click();
  await expect(page.locator(".tool-marquee")).toHaveAttribute(
    "data-paused",
    "true",
  );
  await page
    .getByRole("button", {
      name: "Vositalar harakatini davom ettirish",
      exact: true,
    })
    .click();
  await expect(page.locator(".tool-marquee")).toHaveAttribute(
    "data-paused",
    "false",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".tool-marquee")).toHaveAttribute(
    "data-paused",
    "true",
  );
  await expect(
    page.getByRole("button", {
      name: "Vositalar harakati o‘chiq",
      exact: true,
    }),
  ).toBeDisabled();
  expect(
    await page
      .locator(".course-card")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  const session = await context.newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
  });
  await expect(page.locator(".gallery-root")).toHaveAttribute(
    "data-material",
    "solid",
  );
  await expect(page.locator(".tool-marquee")).toHaveAttribute(
    "data-paused",
    "true",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
