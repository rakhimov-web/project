"use client";
import {
  Button,
  Glass,
  Input,
  Menu,
  SearchField,
  SegmentedControl,
  Slider,
  Switch,
  TabBar,
  type ButtonProps,
} from "glisse";
import { useOptionalTelegram } from "@/lib/telegram/provider";
import type { HapticAction } from "@/lib/telegram/haptics";
import { LoaderCircle } from "lucide-react";
export {
  Glass,
  Input,
  Menu,
  SearchField,
  SegmentedControl,
  Slider,
  Switch,
  TabBar,
};
export function ActionButton({
  busy = false,
  children,
  disabled,
  onClick,
  haptic = "primary",
  ...props
}: ButtonProps & { busy?: boolean; haptic?: HapticAction | "none" }) {
  const telegram = useOptionalTelegram();
  return (
    <Button
      {...props}
      onClick={(event) => {
        if (haptic !== "none") telegram?.haptic(haptic);
        onClick?.(event);
      }}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
    >
      {busy ? (
        <>
          <LoaderCircle className="spinner" aria-hidden="true" />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
