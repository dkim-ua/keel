"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/content/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { buttonClasses } from "./ui/Button";
import { Logo } from "./ui/Logo";

type NavbarProps = { locale: Locale; t: Dictionary["nav"] };

export function Navbar({ locale, t }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: localePath(locale, "#services"), label: t.services },
    { href: localePath(locale, "#process"), label: t.process },
    { href: localePath(locale, "#cases"), label: t.cases },
    { href: localePath(locale, "/about"), label: t.about },
    { href: localePath(locale, "/contact"), label: t.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll and close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && pathname?.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "glass border-b border-line" : "border-b border-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
      >
        {t.skipToContent}
      </a>

      <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-18">
        <Link href={localePath(locale)} aria-label={t.home} className="flex shrink-0 items-center">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                    isActive(link.href) ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} label={t.language} className="max-sm:hidden" />
          <Link href={localePath(locale, "/contact")} className={buttonClasses("primary", "md", "max-sm:hidden")}>
            {t.cta}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.closeMenu : t.openMenu}
            className="-mr-2 flex size-10 items-center justify-center rounded-full text-fg lg:hidden"
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg lg:hidden"
      >
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col pb-8 pt-4">
          <ul className="divide-y divide-line">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-5 text-2xl font-medium tracking-tight text-fg"
                >
                  {link.label}
                  <span className="font-mono text-xs text-subtle" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-6 pt-10">
            <LanguageSwitcher locale={locale} label={t.language} className="text-sm" />
            <Link
              href={localePath(locale, "/contact")}
              onClick={() => setOpen(false)}
              className={buttonClasses("primary", "lg", "w-full")}
            >
              {t.cta}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
