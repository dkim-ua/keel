import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { getDictionary } from "@/content/dictionaries";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({ locale, path: "/contact", title: t.meta.contact.title, description: t.meta.contact.description });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <>
      <PageHeader eyebrow={t.contactPage.eyebrow} title={t.contactPage.title} intro={t.contactPage.text} />
      <section aria-label={t.form.title} className="pb-24 sm:pb-32">
        <div className="container-x grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <aside className="order-2 lg:order-1">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">{t.cta.nextTitle}</p>
            <ol className="mt-5 space-y-5">
              {t.cta.next.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-xs text-muted">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-fg">{step.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {siteConfig.email && (
              <p className="mt-10 text-sm text-muted">
                {t.cta.emailLabel}{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-fg underline decoration-line-strong underline-offset-4">
                  {siteConfig.email}
                </a>
              </p>
            )}
          </aside>
          <div className="order-1 lg:order-2">
            <ContactForm locale={locale} t={t.form} idPrefix="contact-page" />
          </div>
        </div>
      </section>
    </>
  );
}
