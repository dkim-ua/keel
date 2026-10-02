import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cases } from "@/components/Cases";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { TeamModel } from "@/components/TeamModel";
import { Technology } from "@/components/Technology";
import { Value } from "@/components/Value";
import { WhyUs } from "@/components/WhyUs";
import { JsonLd } from "@/components/ui/JsonLd";
import { getCases } from "@/content/cases";
import { getDictionary } from "@/content/dictionaries";
import { getServices } from "@/content/services";
import { isLocale } from "@/lib/i18n";
import { buildMetadata, faqSchema, organizationSchema, websiteSchema } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

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

  return (
    <>
      <JsonLd data={[organizationSchema(t.meta.home.description), websiteSchema(locale), faqSchema(t.faq.items)]} />
      <Hero locale={locale} t={t.hero} />
      <Value t={t.value} />
      <Services locale={locale} t={t.services} services={getServices(locale)} />
      <Process t={t.process} estimateHref="#contact" />
      <TeamModel t={t.team} />
      <WhyUs t={t.why} />
      <Cases locale={locale} t={t.cases} cases={getCases(locale)} />
      <Technology
        eyebrow={t.tech.eyebrow}
        title={t.tech.title}
        subtitle={t.tech.subtitle}
        note={t.tech.note}
        noteText={t.tech.noteText}
        categories={t.tech.categories}
      />
      <FAQ eyebrow={t.faq.eyebrow} title={t.faq.title} items={t.faq.items} />
      <CTA locale={locale} t={t.cta} form={t.form} />
    </>
  );
}
