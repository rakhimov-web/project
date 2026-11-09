import type { Metadata } from "next";
import type { ReactNode } from "react";
import { brand } from "@/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: brand.name,
  description: "AI va dasturlash kurslari — loyiha poydevori.",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={brand.defaultLanguage}>
      <body>{children}</body>
    </html>
  );
}
