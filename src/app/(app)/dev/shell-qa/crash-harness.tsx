"use client";
import { useState } from "react";
import { ActionButton } from "@/components/ui/controls";
import { Surface, Text } from "@/components/ui/primitives";
export function CrashHarness() {
  const [crash, setCrash] = useState(false);
  if (process.env.NODE_ENV !== "development") return null;
  if (crash) throw new Error("DEV_SHELL_ERROR_BOUNDARY_PROBE");
  return (
    <Surface className="stack">
      <Text as="h2" variant="title-2">
        Dev shell QA
      </Text>
      <Text>Bu sahifa production’da mavjud emas.</Text>
      <ActionButton onClick={() => setCrash(true)}>
        Xato holatini sinash
      </ActionButton>
    </Surface>
  );
}
