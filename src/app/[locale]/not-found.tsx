"use client";

import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { localePath } from "@/lib/i18n";

/**
 * Localized 404. not-found files don't receive params, so the locale is read
 * from the URL. Copy is inlined to keep the dictionaries out of the client bundle.
 */
const copy = {
  en: { title: "Page not found", text: "The page you're looking for doesn't exist or has moved.", back: "Back to home" },
  uk: { title: "Сторінку не знайдено", text: "Сторінки не існує або її переміщено.", back: "На головну" },
} as const;

export default function NotFound() {
  const pathname = usePathname() ?? "";
  const locale = pathname === "/uk" || pathname.startsWith("/uk/") ? "uk" : "en";
  const t = copy[locale];

  return (
    <div className="pb-24">
      <PageHeader eyebrow="404" title={t.title} intro={t.text}>
        <ButtonLink href={localePath(locale)} variant="secondary" size="lg">
          {t.back}
        </ButtonLink>
      </PageHeader>
    </div>
  );
}
