import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

for (const [width, height] of [
  [390, 844],
  [360, 800],
  [430, 932],
]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(
      "gallery " + width + "x" + height + " " + colorScheme,
      async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ colorScheme });
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto("/dev/gallery");
        await expect(page.locator(".gallery-root")).toHaveAttribute(
          "data-theme",
          colorScheme,
        );
        await expect(page.getByRole("heading", { level: 1 })).toContainText(
          "Oddiy. Tabiiy.",
        );
        await page.evaluate(() => document.fonts.ready);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        const tooSmall = await page
          .locator("button:not(:disabled), input:not(:disabled)")
          .evaluateAll((elements) =>
            elements
              .filter(
                (element) =>
                  !element.closest("[aria-hidden=true]") &&
                  element.getBoundingClientRect().width > 0,
              )
              .filter((element) => {
                const box = element.getBoundingClientRect();
                return box.width < 43.5 || box.height < 43.5;
              })
              .map((element) => element.outerHTML.slice(0, 180)),
          );
        expect(tooSmall).toEqual([]);
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        );
        expect(errors).toEqual([]);
        if (process.env.CAPTURE_SCREENS) {
          await mkdir("docs/screens/step-01", { recursive: true });
          await page.screenshot({
            path:
              "docs/screens/step-01/gallery-" +
              width +
              "x" +
              height +
              "-" +
              colorScheme +
              ".png",
            fullPage: true,
            animations: "disabled",
          });
        }
      },
    );
  }
}

test("Glisse controls preserve keyboard, values, input errors and sheet focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dev/gallery");
  const group = page.getByRole("radiogroup", {
    name: "Kurs toifasi",
    exact: true,
  });
  await group.getByRole("radio", { name: "Barchasi", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    group.getByRole("radio", { name: "AI", exact: true }),
  ).toBeChecked();
  await expect(page.getByTestId("category-value")).toHaveText("AI");
  await expect(
    group.getByRole("radio", { name: "AI", exact: true }),
  ).toBeFocused();
  expect(
    await group
      .getByRole("radio", { name: "AI", exact: true })
      .evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");
  const navigation = page.getByRole("tablist", {
    name: "Galereya navigatsiyasi",
    exact: true,
  });
  await navigation.getByRole("tab", { name: "Asosiy", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(
    navigation.getByRole("tab", { name: "Profil", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  const toggle = page.getByRole("switch", {
    name: "Bildirishnomalar",
    exact: true,
  });
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).not.toBeChecked();
  const slider = page.getByRole("slider", {
    name: "Ovoz balandligi",
    exact: true,
  });
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("volume-value")).toHaveText("66%");
  const search = page.getByRole("searchbox", {
    name: "Kurs qidirish",
    exact: true,
  });
  await search.fill("Python");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(
    page.getByRole("textbox", { name: "Xato holati", exact: true }),
  ).toHaveAttribute("aria-describedby", "field-error");
  await page
    .getByRole("button", { name: "Qorong‘i rejim", exact: true })
    .click();
  await expect(page.locator(".gallery-root")).toHaveAttribute(
    "data-theme",
    "dark",
  );
  const open = page.getByRole("button", { name: "Sheet ochish", exact: true });
  await open.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("data-theme", "dark");
  if (process.env.CAPTURE_SCREENS)
    await page.screenshot({
      path: "docs/screens/step-01/sheet-dark.png",
      animations: "disabled",
    });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  await page
    .getByRole("button", { name: "Success toast", exact: true })
    .click();
  await expect(
    page.getByText("O‘zgarishlar saqlandi", { exact: true }),
  ).toBeVisible();
});

test("menu keyboard and native disabled groups", async ({ page }) => {
  await page.goto("/dev/gallery");
  const disabled = page.getByRole("group", { name: "Disabled guruh" });
  for (const button of await disabled.getByRole("button").all())
    await expect(button).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Yuklanmoqda", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Kurs amallari", exact: true })
    .click();
  await expect(page.getByRole("menu", { name: "Kurs amallari" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Ulashish" })).toBeDisabled();
  if (process.env.CAPTURE_SCREENS)
    await page.screenshot({
      path: "docs/screens/step-01/menu-light.png",
      animations: "disabled",
    });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("menu", { name: "Kurs amallari" }),
  ).not.toBeVisible();
});

test("solid material, unsupported backdrop, reduced motion and transparency", async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    const supports = CSS.supports.bind(CSS);
    CSS.supports = ((...args: [string, string?]) =>
      args[0] === "backdrop-filter"
        ? false
        : args.length === 1
          ? supports(args[0])
          : supports(args[0], args[1] ?? "")) as typeof CSS.supports;
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/dev/gallery");
  await expect(page.locator(".gallery-root")).toHaveAttribute(
    "data-material",
    "solid",
  );
  await expect(page.locator(".gallery-root")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  expect(
    await page
      .locator(".hero-glass")
      .evaluate((element) => getComputedStyle(element).backdropFilter),
  ).toBe("none");
  expect(
    await page
      .locator(".skeleton")
      .first()
      .evaluate((element) => getComputedStyle(element).animationDuration),
  ).toBe("0s");
  const toggle = page.getByRole("switch", {
    name: "Bildirishnomalar",
    exact: true,
  });
  await toggle.click();
  await expect(toggle).not.toBeChecked();
  const session = await context.newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
  });
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-transparency: reduce)").matches,
    ),
  ).toBe(true);
  await expect(page.locator(".gallery-root")).toHaveAttribute(
    "data-material",
    "solid",
  );
});

test("OS reduced transparency overrides a manual request for glass", async ({
  page,
  context,
}) => {
  const session = await context.newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-transparency", value: "reduce" },
      { name: "prefers-color-scheme", value: "dark" },
    ],
  });
  await page.goto("/dev/gallery");
  await expect(page.locator(".gallery-root")).toHaveAttribute(
    "data-material",
    "solid",
  );
  await expect(page.locator(".gallery-root")).toHaveAttribute(
    "data-theme",
    "dark",
  );
  await expect(
    page.getByRole("switch", { name: "Solid material", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".gallery-root")).toHaveAttribute(
    "data-material",
    "solid",
  );
  expect(
    await page
      .locator(".hero-glass")
      .evaluate((element) => getComputedStyle(element).backdropFilter),
  ).toBe("none");
  await page.getByRole("button", { name: "Yorug‘ rejim", exact: true }).click();
  await expect(page.locator(".gallery-root")).toHaveAttribute(
    "data-theme",
    "light",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
