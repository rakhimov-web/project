import type { HostEvent, TelegramApp } from "./types";

export function supports(app: TelegramApp | null, minimum: string) {
  try {
    return !!app?.isVersionAtLeast(minimum);
  } catch {
    return false;
  }
}
export function safely(action: () => void) {
  try {
    action();
  } catch {
    /* Older/native clients may reject a capability. Keep the static UI usable. */
  }
}
const initialized = new WeakSet<TelegramApp>();
export function initialize(app: TelegramApp) {
  if (initialized.has(app)) return;
  initialized.add(app);
  safely(() => app.ready());
  safely(() => app.expand());
  if (supports(app, "6.1")) safely(() => app.MainButton?.hide());
  if (supports(app, "7.10")) safely(() => app.SecondaryButton?.hide());
  // Fullscreen deliberately stays OFF. Gestures are scoped to sheets, not the shell.
}
export function subscribeHost(app: TelegramApp, notify: () => void) {
  const events: HostEvent[] = ["themeChanged", "viewportChanged"];
  if (supports(app, "8.0"))
    events.push(
      "safeAreaChanged",
      "contentSafeAreaChanged",
      "fullscreenChanged",
    );
  events.forEach((event) => safely(() => app.onEvent(event, notify)));
  return () =>
    events.forEach((event) => safely(() => app.offEvent(event, notify)));
}
function pixels(value: unknown) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 10000
    ? value
    : 0;
}
export function applyGeometry(app: TelegramApp, element: HTMLElement) {
  const stable = pixels(app.viewportStableHeight);
  if (stable > 0)
    element.style.setProperty("--app-viewport-stable-height", stable + "px");
  if (supports(app, "8.0")) {
    for (const side of ["top", "right", "bottom", "left"] as const) {
      element.style.setProperty(
        "--app-safe-" + side,
        pixels(app.safeAreaInset?.[side]) + "px",
      );
      element.style.setProperty(
        "--app-content-" + side,
        pixels(app.contentSafeAreaInset?.[side]) + "px",
      );
    }
  }
}
function fullHex(value: string) {
  const color = value.trim();
  if (/^#[\da-f]{6}$/i.test(color)) return color;
  if (/^#[\da-f]{3}$/i.test(color))
    return (
      "#" +
      color
        .slice(1)
        .split("")
        .map((part) => part + part)
        .join("")
    );
  return null;
}
export function syncHostColors(app: TelegramApp, style: CSSStyleDeclaration) {
  const background = fullHex(style.getPropertyValue("--background"));
  const bottom = fullHex(style.getPropertyValue("--background"));
  if (!background || !bottom) return;
  if (supports(app, "6.1")) {
    safely(() => app.setBackgroundColor?.(background as `#${string}`));
    safely(() =>
      app.setHeaderColor?.(
        supports(app, "6.9") ? (background as `#${string}`) : "bg_color",
      ),
    );
  }
  if (supports(app, "7.10")) safely(() => app.setBottomBarColor?.(bottom));
}
export function bindBackButton(
  app: TelegramApp,
  visible: boolean,
  back: () => void,
) {
  if (!supports(app, "6.1") || !app.BackButton) return () => {};
  const button = app.BackButton;
  safely(() => {
    if (visible) button.show();
    else button.hide();
    button.onClick(back);
  });
  return () =>
    safely(() => {
      button.offClick(back);
      button.hide();
    });
}
export function suspendVerticalSwipes(app: TelegramApp | null) {
  if (!app || !supports(app, "7.7") || !app.disableVerticalSwipes)
    return () => {};
  const previouslyEnabled = app.isVerticalSwipesEnabled;
  safely(() => app.disableVerticalSwipes?.());
  return () => {
    if (previouslyEnabled !== false) safely(() => app.enableVerticalSwipes?.());
  };
}
