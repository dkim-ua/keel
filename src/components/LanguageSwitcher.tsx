"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, localeNames, locales, switchLocalePath, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale, label, className = "" }: { locale: Locale; label: string; className?: string }) {
  const pathname = usePathname() || `/${locale}`;

  return (
    <nav aria-label={label} className={`flex items-center font-mono text-xs tracking-wider ${className}`}>
      {locales.map((l, i) => {
        const active = l === locale;
        return (
          <span key={l} className="flex items-center">
            {i > 0 && <span className="px-1.5 text-subtle" aria-hidden="true">|</span>}
            <Link
              href={switchLocalePath(pathname, l)}
              hrefLang={l}
              lang={l}
              aria-label={localeNames[l]}
              aria-current={active ? "true" : undefined}
              className={`rounded px-1 py-0.5 transition-colors ${active ? "text-fg" : "text-subtle hover:text-fg"}`}
            >
              {localeLabels[l]}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
