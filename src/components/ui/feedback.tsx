"use client";
import type { ReactNode } from "react";
import { Drawer } from "vaul";
import { Toaster, toast } from "sonner";
import { X } from "lucide-react";
import { ActionButton } from "./controls";
import { useMaterial } from "./material-provider";
export { toast };
export function ToastHost() {
  const { theme } = useMaterial();
  return (
    <Toaster
      theme={theme}
      position="bottom-center"
      closeButton
      containerAriaLabel="Bildirishnomalar"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "app-toast",
          title: "text-headline",
          description: "text-footnote",
          closeButton: "toast-close",
        },
      }}
    />
  );
}
export function Sheet({
  trigger,
  title,
  description,
  children,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const { theme, solid } = useMaterial();
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="sheet-overlay" />
        <Drawer.Content
          className="design-root sheet-content"
          data-theme={theme}
          data-material={solid ? "solid" : "glass"}
        >
          <div className="sheet-handle" aria-hidden="true" />
          <div className="sheet-heading">
            <Drawer.Title className="text-title-2">{title}</Drawer.Title>
            <Drawer.Close asChild>
              <ActionButton
                icon={<X aria-hidden="true" />}
                aria-label="Yopish"
              />
            </Drawer.Close>
          </div>
          <Drawer.Description className="tone-secondary text-footnote">
            {description}
          </Drawer.Description>
          <div className="sheet-body">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
