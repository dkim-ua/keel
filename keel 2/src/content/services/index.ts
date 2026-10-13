import type { Locale } from "@/lib/i18n";
import { servicesEn } from "./en";
import { servicesUk } from "./uk";
import { serviceSettings, serviceSlugs, type ServiceContent, type ServiceSlug } from "./types";

const byLocale: Record<Locale, Record<ServiceSlug, ServiceContent>> = { en: servicesEn, uk: servicesUk };

export type ServiceWithSlug = ServiceContent & { slug: ServiceSlug } & (typeof serviceSettings)[ServiceSlug];

export function getService(locale: Locale, slug: ServiceSlug): ServiceWithSlug {
  return { ...byLocale[locale][slug], ...serviceSettings[slug], slug };
}

export function getServices(locale: Locale): ServiceWithSlug[] {
  return serviceSlugs.map((slug) => getService(locale, slug));
}

export { serviceSlugs, isServiceSlug } from "./types";
export type { ServiceSlug, ServiceContent, ServiceIcon } from "./types";
