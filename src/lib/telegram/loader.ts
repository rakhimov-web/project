import type { TelegramApp } from "./types";
const SDK_URL = "https://telegram.org/js/telegram-web-app.js";
let pending: Promise<TelegramApp> | undefined;
export function hasTelegramLaunch(location: Pick<Location, "hash" | "search">) {
  return [location.hash.slice(1), location.search.slice(1)].some((value) =>
    new URLSearchParams(value).has("tgWebAppData"),
  );
}
function loadOfficialSdk() {
  if (pending) return pending;
  pending = new Promise<TelegramApp>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    const timer = window.setTimeout(() => fail(), 10000);
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      pending = undefined;
      reject(new Error("Telegram SDK unavailable"));
    };
    script.onerror = fail;
    script.onload = () => {
      clearTimeout(timer);
      const app = window.Telegram?.WebApp;
      if (!app?.initData) {
        fail();
        return;
      }
      resolve(app);
    };
    document.head.append(script);
  });
  return pending;
}
export async function resolveTelegram() {
  const existing = window.Telegram?.WebApp;
  if (existing?.initData) return { app: existing, mode: "telegram" as const };
  if (hasTelegramLaunch(window.location))
    return { app: await loadOfficialSdk(), mode: "telegram" as const };
  if (process.env.NODE_ENV === "development") {
    const { createDevMock } = await import("./mock");
    const { app } = createDevMock({
      dark: matchMedia("(prefers-color-scheme: dark)").matches,
    });
    return { app, mode: "dev-mock" as const };
  }
  return { app: null, mode: "browser" as const };
}
