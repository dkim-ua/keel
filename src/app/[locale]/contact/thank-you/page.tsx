import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, localePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

/** Shown after a successful no-JavaScript form submission. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/contact/thank-you",
    title: t.meta.thankYou.title,
    description: t.meta.thankYou.description,
    noIndex: true,
  });
}

export default async function ThankYouPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="pb-24">
      <PageHeader title={t.thankYou.title} intro={t.thankYou.text}>
        <ButtonLink href={localePath(locale)} variant="secondary" size="lg">
          {t.thankYou.back}
        </ButtonLink>
      </PageHeader>
    </div>
  );
}
