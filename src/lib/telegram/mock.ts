import type { HostEvent, TelegramApp } from "./types";
/** Dev-only factory. The production loader branch is removed by Next at build time. No auth or storage. */
export function createDevMock(
  options: { version?: string; dark?: boolean } = {},
) {
  const records: string[] = [];
  const listeners = new Map<HostEvent, Set<() => void>>();
  const backListeners = new Set<() => void>();
  const log = (method: string) => {
    records.push(method);
  };
  const back = {
    isVisible: false,
    show() {
      back.isVisible = true;
      log("back:show");
      return back;
    },
    hide() {
      back.isVisible = false;
      log("back:hide");
      return back;
    },
    onClick(callback: () => void) {
      backListeners.add(callback);
      return back;
    },
    offClick(callback: () => void) {
      backListeners.delete(callback);
      return back;
    },
  };
  const feedback = {
    selectionChanged() {
      log("haptic:selection");
      return feedback;
    },
    impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft") {
      log("haptic:" + style);
      return feedback;
    },
    notificationOccurred(type: "success" | "warning" | "error") {
      log("haptic:" + type);
      return feedback;
    },
  };
  const app: TelegramApp = {
    version: options.version ?? "8.0",
    initData: "DEV_MOCK_NO_AUTH_NEVER_SEND",
    initDataUnsafe: {
      auth_date: 0,
      hash: "",
      signature: "",
      user: {
        id: 1001,
        first_name: "Aziz",
        last_name: "Karimov",
        username: "aziz_demo",
        language_code: "uz",
        is_premium: true,
      },
    },
    colorScheme: options.dark ? "dark" : "light",
    viewportHeight: 0,
    viewportStableHeight: 0,
    safeAreaInset: { top: 0, right: 0, bottom: 20, left: 0 },
    contentSafeAreaInset: { top: 0, right: 0, bottom: 0, left: 0 },
    ready() {
      log("ready");
    },
    expand() {
      log("expand");
    },
    isVersionAtLeast(minimum: string) {
      const have = app.version.split(".").map(Number),
        need = minimum.split(".").map(Number);
      for (let i = 0; i < Math.max(have.length, need.length); i++) {
        if ((have[i] ?? 0) !== (need[i] ?? 0))
          return (have[i] ?? 0) > (need[i] ?? 0);
      }
      return true;
    },
    onEvent(event, listener) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)?.add(listener);
    },
    offEvent(event, listener) {
      listeners.get(event)?.delete(listener);
    },
    BackButton: back,
    HapticFeedback: feedback,
    setHeaderColor(color) {
      log("header:" + color);
    },
    setBackgroundColor(color) {
      log("background:" + color);
    },
    setBottomBarColor(color) {
      log("bottom:" + color);
    },
    isVerticalSwipesEnabled: true,
    disableVerticalSwipes() {
      app.isVerticalSwipesEnabled = false;
      log("swipes:disabled");
    },
    enableVerticalSwipes() {
      app.isVerticalSwipesEnabled = true;
      log("swipes:enabled");
    },
    requestFullscreen() {
      log("fullscreen");
    },
  };
  return {
    app,
    records,
    emit(event: HostEvent) {
      listeners.get(event)?.forEach((listener) => listener());
    },
    pressBack() {
      backListeners.forEach((listener) => listener());
    },
    listenerCount() {
      return (
        [...listeners.values()].reduce((sum, set) => sum + set.size, 0) +
        backListeners.size
      );
    },
  };
}
