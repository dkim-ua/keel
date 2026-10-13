import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Onest } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageviewTracker } from "@/components/PageviewTracker";
import { MobileCta } from "@/components/MobileCta";
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

// No `dynamicParams = false` here: it would also apply to nested routes and turn
// every case added later in the admin panel (/work/<new-slug>) into a 404.
// Unknown locales are still rejected below with notFound().
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#05070b" },
  ],
  colorScheme: "dark light",
};

/** Applies a stored light/dark choice before first paint (no flash). */
const themeScript = `try{var t=localStorage.getItem("keel-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

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
      data-site=""
      suppressHydrationWarning
    >
      <body className="min-h-dvh overflow-x-clip">
        <Script id="keel-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <Navbar locale={locale} t={t.nav} theme={t.theme} />
        <main id="main">{children}</main>
        <Footer locale={locale} t={t.footer} nav={t.nav} services={services} />
        <MobileCta href={`/${locale}/contact`} label={t.nav.cta} />
        <RevealObserver />
        <PageviewTracker />
      </body>
    </html>
  );
}
