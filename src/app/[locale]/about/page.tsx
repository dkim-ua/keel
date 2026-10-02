import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTA } from "@/components/CTA";
import { PageHeader } from "@/components/PageHeader";
import { CheckIcon } from "@/components/ui/Icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, localePath } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata, organizationSchema } from "@/lib/seo";
import { revealDelay } from "@/lib/ui";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({ locale, path: "/about", title: t.meta.about.title, description: t.meta.about.description });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getDictionary(locale);
  const a = t.about;
  const s = a.sections;

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(t.meta.home.description),
          breadcrumbSchema([
            { name: t.servicePage.breadcrumbHome, path: localePath(locale) },
            { name: t.nav.about, path: localePath(locale, "/about") },
          ]),
        ]}
      />

      <PageHeader eyebrow={a.eyebrow} title={a.title} intro={a.intro} />

      {/* Who we are */}
      <section aria-labelledby="who-title" className="border-t border-line py-24 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading id="who-title" title={s.who.title} />
          <div className="space-y-5 text-lg leading-relaxed text-muted" data-reveal>
            {s.who.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section aria-labelledby="how-title" className="border-t border-line py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading id="how-title" title={s.how.title} />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {s.how.steps.map((step, i) => (
              <li key={step.title} className="bg-surface p-7" data-reveal style={revealDelay(i * 70)}>
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-lg font-medium text-fg">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why distributed teams */}
      <section aria-labelledby="distributed-title" className="border-t border-line py-24 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading id="distributed-title" title={s.distributed.title} intro={s.distributed.text} className="lg:sticky lg:top-32 lg:self-start" />
          <ul className="border-t border-line">
            {s.distributed.points.map((point, i) => (
              <li
                key={point.title}
                className="grid gap-2 border-b border-line py-7 sm:grid-cols-[0.9fr_1.1fr] sm:gap-8"
                data-reveal
                style={revealDelay(i * 50)}
              >
                <h3 className="text-lg font-medium text-fg">{point.title}</h3>
                <p className="leading-relaxed text-muted">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* One partner */}
      <section aria-labelledby="partner-title" className="border-t border-line py-24 sm:py-28">
        <div className="container-x">
          <div className="card relative overflow-hidden p-8 sm:p-14" data-reveal>
            <div
              aria-hidden="true"
              className="absolute right-[-10rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(143,180,255,0.12),transparent)]"
            />
            <h2 id="partner-title" className="text-h2 relative max-w-3xl font-semibold">
              {s.partner.title}
            </h2>
            <p className="relative mt-6 max-w-3xl text-lg leading-relaxed text-muted">{s.partner.text}</p>
          </div>
        </div>
      </section>

      {/* Projects + what we don't do */}
      <section aria-labelledby="projects-title" className="border-t border-line py-24 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading id="projects-title" title={s.projects.title} />
            <ul className="mt-10 space-y-3">
              {s.projects.items.map((item, i) => (
                <li key={item} className="flex items-start gap-3 text-fg" data-reveal style={revealDelay(i * 40)}>
                  <span className="mt-1 text-accent">
                    <CheckIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="self-start rounded-2xl border border-line p-8 sm:p-10" data-reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-fg">{s.notDo.title}</h2>
            <p className="mt-4 leading-relaxed text-muted">{s.notDo.text}</p>
          </div>
        </div>
      </section>

      <CTA locale={locale} t={t.cta} form={t.form} />
    </>
  );
}
