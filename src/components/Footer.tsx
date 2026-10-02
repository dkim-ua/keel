import Link from "next/link";
import type { Dictionary } from "@/content/dictionaries";
import type { ServiceWithSlug } from "@/content/services";
import { localePath, type Locale } from "@/lib/i18n";
import { siteConfig, socialLinks } from "@/lib/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./ui/Logo";

type FooterProps = {
  locale: Locale;
  t: Dictionary["footer"];
  nav: Dictionary["nav"];
  services: ServiceWithSlug[];
};

export function Footer({ locale, t, nav, services }: FooterProps) {
  const links = [
    { href: localePath(locale, "#services"), label: nav.services },
    { href: localePath(locale, "#process"), label: nav.process },
    { href: localePath(locale, "#cases"), label: nav.cases },
    { href: localePath(locale, "/about"), label: nav.about },
    { href: localePath(locale, "/contact"), label: nav.contact },
  ];
  const social = socialLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-surface/40">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 py-16 sm:py-20 lg:grid-cols-[1.3fr_0.7fr_1fr_0.8fr]">
        <div className="col-span-2 lg:col-span-1">
          <Link href={localePath(locale)} aria-label={nav.home}>
            <Logo />
          </Link>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-subtle">{t.tagline}</p>
          <p className="mt-5 max-w-xs leading-relaxed text-muted">{t.description}</p>
          <Link
            href={localePath(locale, "/contact")}
            className="mt-7 inline-flex items-center gap-2 text-sm text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
          >
            {t.startProject} →
          </Link>
        </div>

        <nav aria-labelledby="footer-nav">
          <p id="footer-nav" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">
            {t.navigation}
          </p>
          <ul className="mt-5 space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted transition-colors hover:text-fg">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services">
          <p id="footer-services" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">
            {t.servicesTitle}
          </p>
          <ul className="mt-5 space-y-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={localePath(locale, `/services/${service.slug}`)} className="text-muted transition-colors hover:text-fg">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {(social.length > 0 || siteConfig.email) && (
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">{t.connect}</p>
            <ul className="mt-5 space-y-3">
              {siteConfig.email && (
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="text-muted transition-colors hover:text-fg">
                    {siteConfig.email}
                  </a>
                </li>
              )}
              {social.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-fg">
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-4 py-6 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {t.rights}
          </p>
          <LanguageSwitcher locale={locale} label={nav.language} />
        </div>
      </div>
    </footer>
  );
}
