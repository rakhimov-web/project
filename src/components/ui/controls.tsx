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
  ...props
}: ButtonProps & { busy?: boolean }) {
  return (
    <Button
      {...props}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
    >
      {busy && <LoaderCircle className="spinner" aria-hidden="true" />}
      {children}
    </Button>
  );
}
