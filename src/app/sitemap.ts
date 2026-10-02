import type { MetadataRoute } from "next";
import { caseSlugs } from "@/content/cases";
import { serviceSlugs } from "@/content/services";
import { htmlLang, localePath, locales } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/work", priority: 0.6, changeFrequency: "monthly" },
    ...serviceSlugs.map((slug) => ({ path: `/services/${slug}`, priority: 0.9, changeFrequency: "monthly" as const })),
    ...caseSlugs.map((slug) => ({ path: `/work/${slug}`, priority: 0.5, changeFrequency: "monthly" as const })),
  ];

  const lastModified = new Date();

  return paths.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [htmlLang[l], absoluteUrl(localePath(l, path))])),
      },
    })),
  );
}
