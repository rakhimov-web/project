import { Suspense, type ReactNode } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { Skeleton } from "@/components/ui/primitives";
export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <main className="design-root app-shell shell-loading">
          <Skeleton label="Ilova tayyorlanmoqda" />
        </main>
      }
    >
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
