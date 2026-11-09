"use client";
import { useSyncExternalStore, type ReactNode } from "react";
import { motion } from "motion/react";
import { useMaterial } from "@/components/ui/material-provider";
import { useAppNavigation } from "@/lib/navigation/provider";
import {
  motionSnapshot,
  noMotionSubscription,
  parseMotionTokens,
} from "@/lib/navigation/motion";
export function RouteFrame({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    noMotionSubscription,
    motionSnapshot,
    () => "",
  );
  const { stiffness, damping, mass, distance } = parseMotionTokens(snapshot);
  const { reducedMotion } = useMaterial();
  const { direction } = useAppNavigation();
  return (
    <motion.div
      className="route-frame"
      initial={reducedMotion ? false : { opacity: 0, x: distance * direction }}
      animate={{ opacity: 1, x: 0 }}
      transition={
        reducedMotion || !snapshot
          ? { duration: 0 }
          : { type: "spring", stiffness, damping, mass }
      }
    >
      {children}
    </motion.div>
  );
}
