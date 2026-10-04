import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Onest } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageviewTracker } from "@/components/PageviewTracker";
import { RevealObserver } from "@/components/RevealObserver";
import { getDictionary } from "@/content/dictionaries";
import { getServices } from "@/content/services";
import { htmlLang, isLocale, locales } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import "../globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-onest",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#05070b",
  colorScheme: "dark",
};

type LayoutProps = { children: ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t.meta.home.title, template: `%s — ${siteConfig.name}` },
    description: t.meta.home.description,
    applicationName: siteConfig.name,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getDictionary(locale);
  const services = getServices(locale);

  return (
    <html
      lang={htmlLang[locale]}
      className={`${onest.variable} ${mono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-dvh overflow-x-clip">
        <Navbar locale={locale} t={t.nav} />
        <main id="main">{children}</main>
        <Footer locale={locale} t={t.footer} nav={t.nav} services={services} />
        <RevealObserver />
        <PageviewTracker />
      </body>
    </html>
  );
}
