import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedWork, HomeProcess, ServiceGrid, TechMarquee, WhyKeel } from "@/components/home/HomeSections";
import { JsonLd } from "@/components/ui/JsonLd";
import { getFeaturedCases } from "@/lib/db/cases";
import { getDictionary } from "@/content/dictionaries";
import { getServices } from "@/content/services";
import { isLocale } from "@/lib/i18n";
import { buildMetadata, faqSchema, organizationSchema, websiteSchema } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

/** Re-render at most every 5 minutes; admin edits refresh pages immediately via revalidatePath. */
export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({ locale, path: "/", title: t.meta.home.title, description: t.meta.home.description, absoluteTitle: true });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getDictionary(locale);
  const featured = await getFeaturedCases(locale);
  // Short FAQ on the home page: cost, timing, international work, NDA, support.
  const faq = [0, 1, 7, 6, 5].map((i) => t.faq.items[i]).filter(Boolean);
  const tech = t.tech.categories.flatMap((c) => c.items).filter((item) => !/integrations|API/i.test(item));

  return (
    <>
      <JsonLd data={[organizationSchema(t.meta.home.description), websiteSchema(locale), faqSchema(faq)]} />
      <HomeHero hero={t.hero} home={t.home} featured={featured} />
      <TechMarquee label={t.home.marqueeLabel} items={tech} />
      <FeaturedWork locale={locale} t={t.home.work} badges={t.cases} cases={featured} />
      <ServiceGrid locale={locale} t={t.home.services} services={getServices(locale)} />
      <HomeProcess t={t.home.process} />
      <WhyKeel t={t.home.why} />
      <FAQ eyebrow={t.faq.eyebrow} title={t.faq.title} items={faq} />
      <CTA locale={locale} t={t.cta} form={t.form} />
    </>
  );
}
