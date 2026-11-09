import type { TelegramApp } from "./types";
import { safely, supports } from "./bridge";
export const hapticMap = {
  selection: { kind: "selection" },
  primary: { kind: "impact", value: "light" },
  success: { kind: "notification", value: "success" },
  error: { kind: "notification", value: "error" },
  destructive: { kind: "impact", value: "heavy" },
  warning: { kind: "notification", value: "warning" },
} as const;
export type HapticAction = keyof typeof hapticMap;
export function emitHaptic(
  app: TelegramApp | null,
  action: HapticAction,
  enabled: boolean,
) {
  if (!enabled || !supports(app, "6.1") || !app?.HapticFeedback) return;
  const feedback = app.HapticFeedback;
  const pattern = hapticMap[action];
  safely(() => {
    if (pattern.kind === "selection") feedback.selectionChanged();
    else if (pattern.kind === "impact") feedback.impactOccurred(pattern.value);
    else feedback.notificationOccurred(pattern.value);
  });
}
