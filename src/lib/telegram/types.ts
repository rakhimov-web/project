import type { WebApp, WebAppUser } from "@twa-dev/types";

export type TelegramUser = WebAppUser;
export type HostEvent =
  | "themeChanged"
  | "viewportChanged"
  | "safeAreaChanged"
  | "contentSafeAreaChanged"
  | "fullscreenChanged";
export type TelegramApp = Pick<
  WebApp,
  | "version"
  | "initData"
  | "initDataUnsafe"
  | "colorScheme"
  | "viewportHeight"
  | "viewportStableHeight"
  | "ready"
  | "expand"
  | "isVersionAtLeast"
> &
  Partial<
    Pick<
      WebApp,
      | "BackButton"
      | "MainButton"
      | "SecondaryButton"
      | "HapticFeedback"
      | "safeAreaInset"
      | "contentSafeAreaInset"
      | "setHeaderColor"
      | "setBackgroundColor"
      | "setBottomBarColor"
      | "disableVerticalSwipes"
      | "enableVerticalSwipes"
      | "isVerticalSwipesEnabled"
      | "requestFullscreen"
    >
  > & {
    onEvent: (event: HostEvent, listener: () => void) => void;
    offEvent: (event: HostEvent, listener: () => void) => void;
  };
export type LaunchMode =
  "loading" | "telegram" | "dev-mock" | "browser" | "error";
export type Insets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramApp };
  }
}
