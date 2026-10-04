import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTA } from "@/components/CTA";
import { PageHeader } from "@/components/PageHeader";
import { CheckIcon } from "@/components/ui/Icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { getCase, getCaseSlugs } from "@/lib/db/cases";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, localePath } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { revealDelay } from "@/lib/ui";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

// New cases added in the admin panel are rendered on first request.
export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getCaseSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = await getCase(locale, slug);
  if (!item) return {};
  const t = getDictionary(locale);
  const label = item.kind === "concept" ? ` (${t.cases.conceptBadge})` : "";
  return buildMetadata({ locale, path: `/work/${slug}`, title: `${item.name}${label}`, description: item.summary });
}

export default async function CasePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = await getCase(locale, slug);
  if (!item) notFound();

  const t = getDictionary(locale);
  const c = t.casePage;
  const concept = item.kind === "concept";

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: t.servicePage.breadcrumbHome, path: localePath(locale) },
          { name: t.cases.title, path: localePath(locale, "/work") },
          { name: item.name, path: localePath(locale, `/work/${slug}`) },
        ])}
      />

      <PageHeader
        breadcrumbs={[
          { label: t.servicePage.breadcrumbHome, href: localePath(locale) },
          { label: c.back, href: localePath(locale, "/work") },
          { label: item.name },
        ]}
        eyebrow={item.type}
        title={item.name}
        intro={item.summary}
      >
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-fg transition-colors hover:border-muted/60"
          >
            {c.visit} <span aria-hidden="true">↗</span>
          </a>
        )}
        {concept && (
          <div className="max-w-2xl rounded-xl border border-line-strong bg-surface/70 px-5 py-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">{c.disclaimerTitle}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.disclaimer}</p>
          </div>
        )}
      </PageHeader>

      {(item.cover || (item.gallery?.length ?? 0) > 0) && (
        <section aria-label={c.gallery} className="pb-4">
          <div className="container-x space-y-4">
            {[item.cover, ...(item.gallery ?? [])].filter(Boolean).map((src, i) => (
              <figure key={`${src}-${i}`} className="overflow-hidden rounded-2xl border border-line bg-surface" data-reveal>
                {/* eslint-disable-next-line @next/next/no-img-element -- uploaded images are already resized to WebP */}
                <img src={src} alt={`${item.name} — ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} decoding="async" className="w-full" />
              </figure>
            ))}
          </div>
        </section>
      )}

      <section aria-label={item.name} className="border-t border-line py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div className="space-y-14">
            <div data-reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-fg">{c.challenge}</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">{item.challenge}</p>
            </div>
            <div data-reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-fg">{c.solution}</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">{item.solution}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-fg" data-reveal>
                {c.architecture}
              </h2>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {item.architecture.map((block, i) => (
                  <li key={block.name} className="bg-surface p-6" data-reveal style={revealDelay((i % 2) * 60)}>
                    <h3 className="font-mono text-sm text-accent">{block.name}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{block.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6" data-reveal>
              <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">{c.scope}</h2>
              <ul className="mt-4 space-y-2.5">
                {item.scope.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-fg">
                    <span className="mt-1 text-accent">
                      <CheckIcon />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6" data-reveal>
              <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">{c.stack}</h2>
              <p className="mt-4 flex flex-wrap gap-1.5">
                {item.stack.map((tech) => (
                  <span key={tech} className="rounded-md bg-surface-2 px-2.5 py-1 text-sm text-muted">
                    {tech}
                  </span>
                ))}
              </p>
            </div>
            <div className="card p-6" data-reveal>
              <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">
                {concept ? c.focus : t.cases.clientOutcome}
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{item.outcome}</p>
            </div>
          </aside>
        </div>
      </section>

      <CTA locale={locale} t={t.cta} form={t.form} title={c.cta} text={c.ctaText} />
    </>
  );
}
