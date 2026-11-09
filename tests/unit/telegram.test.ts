import { describe, expect, it } from "vitest";
import { createDevMock } from "../../src/lib/telegram/mock";
import {
  initialize,
  bindBackButton,
  subscribeHost,
  suspendVerticalSwipes,
} from "../../src/lib/telegram/bridge";
import { emitHaptic } from "../../src/lib/telegram/haptics";
import { routeInfo } from "../../src/lib/navigation/routes";
import { hasTelegramLaunch } from "../../src/lib/telegram/loader";
import { parseMotionTokens } from "../../src/lib/navigation/motion";
describe("Telegram lifecycle and capability boundaries", () => {
  it("initializes once, never requests fullscreen or emits automatic haptics", () => {
    const host = createDevMock();
    initialize(host.app);
    initialize(host.app);
    expect(host.records).toEqual(["ready", "expand"]);
  });
  it("uses one callback per event and removes every listener", () => {
    const host = createDevMock();
    let calls = 0;
    const stop = subscribeHost(host.app, () => {
      calls++;
    });
    host.emit("themeChanged");
    host.emit("contentSafeAreaChanged");
    expect(calls).toBe(2);
    expect(host.listenerCount()).toBe(5);
    stop();
    host.emit("themeChanged");
    expect(calls).toBe(2);
    expect(host.listenerCount()).toBe(0);
  });
  it("registers host Back without leaking its handler", () => {
    const host = createDevMock();
    let calls = 0;
    const stop = bindBackButton(host.app, true, () => {
      calls++;
    });
    host.pressBack();
    expect(calls).toBe(1);
    stop();
    host.pressBack();
    expect(calls).toBe(1);
    expect(host.app.BackButton?.isVisible).toBe(false);
    expect(host.listenerCount()).toBe(0);
  });
  it("respects old clients, user preference and haptics map", () => {
    const old = createDevMock({ version: "6.0" }),
      modern = createDevMock();
    emitHaptic(old.app, "primary", true);
    emitHaptic(modern.app, "primary", false);
    expect(old.records).toEqual([]);
    expect(modern.records).toEqual([]);
    for (const action of [
      "selection",
      "primary",
      "success",
      "error",
      "destructive",
      "warning",
    ] as const)
      emitHaptic(modern.app, action, true);
    expect(modern.records).toEqual([
      "haptic:selection",
      "haptic:light",
      "haptic:success",
      "haptic:error",
      "haptic:heavy",
      "haptic:warning",
    ]);
    const stop = subscribeHost(old.app, () => {});
    expect(old.listenerCount()).toBe(2);
    stop();
  });
  it("restores gesture preference and never enables a previously disabled gesture", () => {
    const host = createDevMock();
    suspendVerticalSwipes(host.app)();
    expect(host.records).toEqual(["swipes:disabled", "swipes:enabled"]);
    host.records.length = 0;
    host.app.isVerticalSwipesEnabled = false;
    suspendVerticalSwipes(host.app)();
    expect(host.records).toEqual(["swipes:disabled"]);
    const old = createDevMock({ version: "7.6" });
    suspendVerticalSwipes(old.app)();
    expect(old.records).toEqual([]);
  });
  it("identifies launch parameters without treating arbitrary hash text as a launch", () => {
    expect(
      hasTelegramLaunch({ hash: "#tgWebAppData=encoded", search: "" }),
    ).toBe(true);
    expect(
      hasTelegramLaunch({ hash: "", search: "?tgWebAppData=encoded" }),
    ).toBe(true);
    expect(hasTelegramLaunch({ hash: "#ordinary", search: "?course=ai" })).toBe(
      false,
    );
  });
  it("gives directly opened nested routes a safe in-app parent", () => {
    expect(routeInfo("/courses/ai").parent).toBe("/courses");
    expect(routeInfo("/lessons/one").parent).toBe("/learning");
    expect(routeInfo("/profile/settings").parent).toBe("/profile");
    expect(routeInfo("/profile").parent).toBeNull();
  });
  it("derives route spring and distance from the shared CSS token snapshot", () => {
    expect(parseMotionTokens("380|32|.8|2rem|16px")).toEqual({
      stiffness: 380,
      damping: 32,
      mass: 0.8,
      distance: 32,
    });
  });
});

import { syncHostColors, applyGeometry } from "../../src/lib/telegram/bridge";
it("normalizes optimized CSS hex tokens and gates custom header colors", () => {
  const style = {
    getPropertyValue: () => "#fff",
  } as unknown as CSSStyleDeclaration;
  const modern = createDevMock();
  syncHostColors(modern.app, style);
  expect(modern.records).toEqual([
    "background:#ffffff",
    "header:#ffffff",
    "bottom:#ffffff",
  ]);
  const older = createDevMock({ version: "6.1" });
  syncHostColors(older.app, style);
  expect(older.records).toEqual(["background:#ffffff", "header:bg_color"]);
});
it("sanitizes host geometry and does not overwrite a stable height with invalid data", () => {
  const values = new Map<string, string>();
  const element = {
    style: {
      setProperty: (key: string, value: string) => values.set(key, value),
    },
  } as unknown as HTMLElement;
  const host = createDevMock();
  host.app.viewportStableHeight = 700;
  applyGeometry(host.app, element);
  host.app.viewportStableHeight = Number.NaN;
  host.app.safeAreaInset = { top: -2, right: Number.NaN, bottom: 34, left: 0 };
  applyGeometry(host.app, element);
  expect(values.get("--app-viewport-stable-height")).toBe("700px");
  expect(values.get("--app-safe-top")).toBe("0px");
  expect(values.get("--app-safe-right")).toBe("0px");
  expect(values.get("--app-safe-bottom")).toBe("34px");
});
