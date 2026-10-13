export const locales = ["en", "uk"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Label shown in the language switcher. */
export const localeLabels: Record<Locale, string> = { en: "EN", uk: "UA" };

/** Full language name, used for aria labels. */
export const localeNames: Record<Locale, string> = { en: "English", uk: "Українська" };

/** Value for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = { en: "en", uk: "uk" };

/** Open Graph locale format. */
export const ogLocale: Record<Locale, string> = { en: "en_US", uk: "uk_UA" };

/**
 * Builds a locale-prefixed path.
 * localePath("en") -> "/en", localePath("uk", "/about") -> "/uk/about"
 */
export function localePath(locale: Locale, path = ""): string {
  if (!path || path === "/") return `/${locale}`;
  if (path.startsWith("#")) return `/${locale}${path}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Replaces the locale segment of the current pathname. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }
  return localePath(target, pathname);
}
