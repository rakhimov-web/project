"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { LaunchMode, TelegramApp, TelegramUser } from "./types";
import { applyGeometry, initialize, subscribeHost } from "./bridge";
import { emitHaptic, type HapticAction } from "./haptics";
import { resolveTelegram } from "./loader";
type TelegramContextValue = {
  mode: LaunchMode;
  app: TelegramApp | null;
  theme?: "light" | "dark";
  user?: TelegramUser;
  overlayBack: (() => void) | null;
  registerOverlayBack: (close: () => void) => () => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  haptic: (action: HapticAction) => void;
  retry: () => void;
};
const TelegramContext = createContext<TelegramContextValue | null>(null);
export function TelegramProvider({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [launch, setLaunch] = useState<{
    mode: LaunchMode;
    app: TelegramApp | null;
    theme?: "light" | "dark";
    user?: TelegramUser;
  }>({ mode: "loading", app: null });
  const [attempt, setAttempt] = useState(0);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [overlayBack, setOverlayBack] = useState<(() => void) | null>(null);
  const registerOverlayBack = useCallback((close: () => void) => {
    setOverlayBack(() => close);
    return () =>
      setOverlayBack((current) => (current === close ? null : current));
  }, []);
  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};
    resolveTelegram()
      .then(({ app, mode }) => {
        if (cancelled) return;
        if (!app) {
          setLaunch({ app, mode });
          return;
        }
        initialize(app);
        const notify = () => {
          if (root.current) applyGeometry(app, root.current);
          // initDataUnsafe is presentation-only. This is NOT authentication.
          setLaunch({
            app,
            mode,
            theme: app.colorScheme === "dark" ? "dark" : "light",
            user: app.initDataUnsafe?.user,
          });
        };
        unsubscribe = subscribeHost(app, notify);
        notify();
      })
      .catch(() => {
        if (!cancelled) setLaunch({ mode: "error", app: null });
      });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [attempt]);
  const haptic = useCallback(
    (action: HapticAction) => emitHaptic(launch.app, action, hapticsEnabled),
    [launch.app, hapticsEnabled],
  );
  const retry = useCallback(() => {
    setLaunch({ mode: "loading", app: null });
    setAttempt((value) => value + 1);
  }, []);
  return (
    <TelegramContext.Provider
      value={{
        ...launch,
        overlayBack,
        registerOverlayBack,
        hapticsEnabled,
        setHapticsEnabled,
        haptic,
        retry,
      }}
    >
      <div ref={root} className="telegram-root" data-launch-mode={launch.mode}>
        {children}
      </div>
    </TelegramContext.Provider>
  );
}
export function useOptionalTelegram() {
  return useContext(TelegramContext);
}
export function useTelegram() {
  const value = useOptionalTelegram();
  if (!value) throw new Error("TelegramProvider is required");
  return value;
}
