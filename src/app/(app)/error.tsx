"use client";
import { FailureView } from "@/components/shell/status-views";
export default function ErrorBoundary({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <FailureView
      title="Sahifani ochib bo‘lmadi"
      description="Qayta urinib ko‘ring. Muammo davom etsa, ilovani qayta oching."
      action="Qayta urinish"
      onAction={retry}
    />
  );
}
