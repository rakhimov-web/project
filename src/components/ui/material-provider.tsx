"use client";
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { MotionConfig } from "motion/react";

function subscribe(callback: () => void) {
  const queries = [
    matchMedia("(prefers-color-scheme: dark)"),
    matchMedia("(prefers-reduced-transparency: reduce)"),
    matchMedia("(prefers-reduced-motion: reduce)"),
  ];
  queries.forEach((query) => query.addEventListener("change", callback));
  return () =>
    queries.forEach((query) => query.removeEventListener("change", callback));
}
function snapshot() {
  return [
    matchMedia("(prefers-color-scheme: dark)").matches,
    matchMedia("(prefers-reduced-transparency: reduce)").matches ||
      !CSS.supports("backdrop-filter", "blur(1px)"),
    matchMedia("(prefers-reduced-motion: reduce)").matches,
  ].join(",");
}
type Material = {
  theme: "light" | "dark";
  solid: boolean;
  solidRequired: boolean;
  reducedMotion: boolean;
  setTheme: (theme: "light" | "dark") => void;
  setSolid: (solid: boolean) => void;
};
const MaterialContext = createContext<Material | null>(null);
export function MaterialProvider({ children }: { children: ReactNode }) {
  const system = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "false,true,false",
  ).split(",");
  const [themeOverride, setTheme] = useState<"light" | "dark">();
  const [solidOverride, setSolid] = useState(false);
  const theme = themeOverride ?? (system[0] === "true" ? "dark" : "light");
  const solid = solidOverride || system[1] === "true";
  const reducedMotion = system[2] === "true";
  return (
    <MaterialContext.Provider
      value={{
        theme,
        solid,
        solidRequired: system[1] === "true",
        reducedMotion,
        setTheme,
        setSolid,
      }}
    >
      <MotionConfig reducedMotion="user">
        <div
          className="design-root gallery-root"
          data-theme={theme}
          data-material={solid ? "solid" : "glass"}
          data-reduced-motion={reducedMotion ? "true" : undefined}
        >
          {children}
        </div>
      </MotionConfig>
    </MaterialContext.Provider>
  );
}
export function useMaterial() {
  const context = useContext(MaterialContext);
  if (!context) throw new Error("MaterialProvider is required");
  return context;
}
