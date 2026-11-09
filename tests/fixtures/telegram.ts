import type { Page } from "@playwright/test";
import { createDevMock } from "../../src/lib/telegram/mock";
declare global {
  interface Window {
    __tgFixture?: ReturnType<typeof createDevMock>;
  }
}
/** Browser-injected protocol simulator. This file is never an application import. */
export async function installHost(
  page: Page,
  options: { version?: string; dark?: boolean } = {},
) {
  await page.addInitScript({
    content:
      "window.__tgFixture = (" +
      createDevMock.toString() +
      ")(" +
      JSON.stringify(options) +
      "); window.Telegram = { WebApp: window.__tgFixture.app };",
  });
}
