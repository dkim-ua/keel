import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cases } from "@/components/Cases";
import { CTA } from "@/components/CTA";
import { getCases } from "@/content/cases";
import { getDictionary } from "@/content/dictionaries";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({ locale, path: "/work", title: t.meta.work.title, description: t.meta.work.description });
}

export default async function WorkPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="pt-12">
      <Cases locale={locale} t={t.cases} cases={getCases(locale)} headingLevel="h1" id="work" />
      <CTA locale={locale} t={t.cta} form={t.form} />
    </div>
  );
}
