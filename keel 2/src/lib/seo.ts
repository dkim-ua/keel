import type { Metadata } from "next";
import { htmlLang, locales, localePath, ogLocale, type Locale } from "./i18n";
import { absoluteUrl, siteConfig } from "./site";

type BuildMetadataInput = {
  locale: Locale;
  /** Path WITHOUT locale prefix, e.g. "/" or "/services/web-development". */
  path: string;
  title: string;
  description: string;
  /** Use the title as-is instead of appending the brand. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

export function buildMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const canonical = localePath(locale, path);
  const languages: Record<string, string> = {};
  for (const l of locales) languages[htmlLang[l]] = localePath(l, path);
  languages["x-default"] = localePath("en", path);

  const fullTitle = absoluteTitle ? title : `${title} — ${siteConfig.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: canonical,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/* ───────────────────────── Schema.org (JSON-LD) ───────────────────────── */

export function organizationSchema(description: string) {
  const sameAs = [siteConfig.social.linkedin, siteConfig.social.github].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    description,
    slogan: siteConfig.tagline,
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: absoluteUrl(localePath(locale)),
    inLanguage: htmlLang[locale],
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function serviceSchema(input: { locale: Locale; slug: string; name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.name,
    url: absoluteUrl(localePath(input.locale, `/services/${input.slug}`)),
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: "Worldwide",
    inLanguage: htmlLang[input.locale],
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
