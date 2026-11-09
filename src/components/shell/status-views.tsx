"use client";
import { CircleAlert, WifiOff } from "lucide-react";
import { ActionButton } from "@/components/ui/controls";
import { Surface, Text } from "@/components/ui/primitives";
export function FailureView({
  title,
  description,
  action,
  onAction,
}: {
  title: string;
  description: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <Surface className="shell-status stack">
      <span className="state-icon">
        <CircleAlert aria-hidden="true" />
      </span>
      <Text as="h2" variant="title-2">
        {title}
      </Text>
      <Text tone="secondary">{description}</Text>
      <ActionButton onClick={onAction}>{action}</ActionButton>
    </Surface>
  );
}
export function SdkFailure({ retry }: { retry: () => void }) {
  return (
    <FailureView
      title="Telegram bilan ulanish amalga oshmadi"
      description="Internet aloqasini tekshiring va qayta urinib ko‘ring."
      action="Qayta ulanish"
      onAction={retry}
    />
  );
}
export function OfflineView() {
  return (
    <Surface className="shell-status stack" role="status">
      <span className="state-icon">
        <WifiOff aria-hidden="true" />
      </span>
      <Text as="h2" variant="title-2">
        Internet aloqasi yo‘q
      </Text>
      <Text tone="secondary">
        Aloqa tiklanganda sahifa yana ko‘rinadi. Hozirgi oynani ochiq
        qoldirishingiz mumkin.
      </Text>
      <ActionButton
        onClick={() =>
          window.dispatchEvent(
            new Event(navigator.onLine ? "online" : "offline"),
          )
        }
      >
        Qayta tekshirish
      </ActionButton>
    </Surface>
  );
}
