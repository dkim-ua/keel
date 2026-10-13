import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { PageHeader } from "@/components/PageHeader";
import { Process } from "@/components/Process";
import { Technology } from "@/components/Technology";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ui/Icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/content/dictionaries";
import { getService, getServices, isServiceSlug, serviceSlugs } from "@/content/services";
import { isLocale, localePath } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata, faqSchema, serviceSchema } from "@/lib/seo";
import { revealDelay } from "@/lib/ui";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isServiceSlug(slug)) return {};
  const service = getService(locale, slug);
  return buildMetadata({ locale, path: `/services/${slug}`, title: service.seo.title, description: service.seo.description });
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isServiceSlug(slug)) notFound();

  const t = getDictionary(locale);
  const p = t.servicePage;
  const service = getService(locale, slug);
  const others = getServices(locale).filter((s) => s.slug !== slug);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({ locale, slug, name: service.name, description: service.seo.description }),
          faqSchema(service.faq),
          breadcrumbSchema([
            { name: p.breadcrumbHome, path: localePath(locale) },
            { name: p.breadcrumbServices, path: localePath(locale, "#services") },
            { name: service.name, path: localePath(locale, `/services/${slug}`) },
          ]),
        ]}
      />

      <PageHeader
        breadcrumbs={[
          { label: p.breadcrumbHome, href: localePath(locale) },
          { label: p.breadcrumbServices, href: localePath(locale, "#services") },
          { label: service.name },
        ]}
        eyebrow={
          <span className="flex items-center gap-2.5 text-accent">
            <ServiceIcon name={service.icon} className="size-4" />
            <span className="text-muted">{service.name}</span>
          </span>
        }
        title={service.hero.title}
        intro={service.hero.description}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#contact" size="lg" arrow>
            {service.cta.button}
          </ButtonLink>
          <ButtonLink href="#process" size="lg" variant="secondary">
            {t.hero.secondaryCta}
          </ButtonLink>
        </div>
      </PageHeader>

      {/* What we build */}
      <section aria-labelledby="build-title" className="border-t border-line py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading id="build-title" eyebrow={service.name} title={p.whatWeBuild} />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {service.build.map((item, i) => (
              <li key={item.title} className="bg-surface p-7 sm:p-9" data-reveal style={revealDelay((i % 2) * 70)}>
                <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                <h3 className="mt-5 text-xl font-medium text-fg">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Typical use cases */}
      <section aria-labelledby="usecases-title" className="border-t border-line py-24 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading id="usecases-title" title={p.useCases} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {service.useCases.map((useCase, i) => (
              <li
                key={useCase}
                className="flex items-center gap-4 rounded-xl border border-line bg-surface px-5 py-4 text-fg"
                data-reveal
                style={revealDelay(i * 40)}
              >
                <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {useCase}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Our approach */}
      <section aria-labelledby="approach-title" className="border-t border-line py-24 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading id="approach-title" title={p.approach} className="lg:sticky lg:top-32 lg:self-start" />
          <ol className="border-t border-line">
            {service.approach.map((item, i) => (
              <li
                key={item.title}
                className="grid gap-2 border-b border-line py-7 sm:grid-cols-[3.5rem_0.9fr_1.1fr] sm:gap-6"
                data-reveal
                style={revealDelay(i * 50)}
              >
                <span className="font-mono text-xs text-accent sm:pt-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-medium text-fg">{item.title}</h3>
                <p className="leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Technology
        title={p.technology}
        note={t.tech.note}
        noteText={p.technologyNote}
        categories={service.technology}
      />

      <Process t={t.process} title={p.process} showIntro={false} />

      <FAQ title={p.faq} items={service.faq} />

      {/* Other services */}
      <section aria-labelledby="other-title" className="border-t border-line py-16">
        <div className="container-x">
          <h2 id="other-title" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">
            {p.otherServices}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={localePath(locale, `/services/${s.slug}`)}
                  className="inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-2.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
                >
                  <ServiceIcon name={s.icon} className="size-4 text-accent" />
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTA
        locale={locale}
        t={t.cta}
        form={t.form}
        title={service.cta.title}
        text={service.cta.text}
        defaultProjectType={service.formType}
      />
    </>
  );
}
