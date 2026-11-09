import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { brand } from "@/config/brand";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export const metadata: Metadata = {
  title: brand.displayName,
  description: "AI va dasturlash bo‘yicha amaliy video kurslar.",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={brand.defaultLanguage} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
