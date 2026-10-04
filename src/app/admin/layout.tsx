import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Onest } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

const onest = Onest({ subsets: ["latin", "cyrillic"], display: "swap", variable: "--font-onest" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], display: "swap", variable: "--font-jetbrains", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: { default: "Keel Admin", template: "%s — Keel Admin" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#05070b", colorScheme: "dark" };

/** Separate root layout for the admin panel (outside the localized site). */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${onest.variable} ${mono.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
