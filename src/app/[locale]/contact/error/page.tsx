import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, localePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

/** Shown when a no-JavaScript form submission could not be delivered. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({ locale, path: "/contact/error", title: t.meta.error.title, description: t.meta.error.description, noIndex: true });
}

export default async function ContactErrorPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="pb-24">
      <PageHeader title={t.errorPage.title} intro={t.errorPage.text}>
        <ButtonLink href={localePath(locale, "/contact")} size="lg">
          {t.errorPage.retry}
        </ButtonLink>
      </PageHeader>
    </div>
  );
}
