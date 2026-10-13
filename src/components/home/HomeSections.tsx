import Link from "next/link";
import type { CaseStudy } from "@/content/cases";
import type { Dictionary } from "@/content/dictionaries";
import type { ServiceWithSlug } from "@/content/services";
import { localePath, type Locale } from "@/lib/i18n";
import { revealDelay } from "@/lib/ui";
import { Arrow } from "../ui/Button";
import { ServiceIcon } from "../ui/Icons";

/* ───────────────────────── Shared heading ───────────────────────── */

function Heading({ id, eyebrow, title, className = "" }: { id: string; eyebrow: string; title: string; className?: string }) {
  return (
    <div className={`max-w-2xl ${className}`} data-reveal>
      <p className="mb-4 text-sm font-semibold text-accent">{eyebrow}</p>
      <h2 id={id} className="text-h2 font-semibold text-fg">
        {title}
      </h2>
    </div>
  );
}

/* ───────────────────────── Technology marquee ───────────────────────── */

export function TechMarquee({ label, items }: { label: string; items: string[] }) {
  const list = Array.from(new Set(items));
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
      {list.map((item) => (
        <li key={item} className="whitespace-nowrap text-lg font-medium text-subtle sm:text-xl">
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label} className="marquee overflow-hidden border-y border-line py-5 sm:py-6">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

/* ───────────────────────── Featured work ───────────────────────── */

export function FeaturedWork({ locale, t, badges, cases }: { locale: Locale; t: Dictionary["home"]["work"]; badges: Dictionary["cases"]; cases: CaseStudy[] }) {
  if (!cases.length) return null;
  return (
    <section id="cases" aria-labelledby="cases-title" className="py-24 sm:py-32">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <Heading id="cases-title" eyebrow={t.eyebrow} title={t.title} />
        <Link href={localePath(locale, "/work")} className="group inline-flex items-center gap-2 text-sm font-medium text-fg max-md:hidden" data-reveal>
          {t.all}
          <Arrow />
        </Link>
      </div>

      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 sm:scroll-px-8 sm:px-8 md:mx-auto md:grid md:max-w-[76rem] md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-3">
        {cases.map((item, i) => (
          <li key={item.slug} className="w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto" data-reveal style={revealDelay(i * 90)}>
            <WorkCard locale={locale} t={t} badges={badges} item={item} />
          </li>
        ))}
      </ul>

      <div className="container-x mt-6 flex items-center justify-between md:hidden">
        <span className="text-sm text-subtle">{t.swipe} →</span>
        <Link href={localePath(locale, "/work")} className="group inline-flex items-center gap-2 text-sm font-medium text-fg">
          {t.all}
          <Arrow />
        </Link>
      </div>
    </section>
  );
}

function WorkCard({ locale, t, badges, item }: { locale: Locale; t: Dictionary["home"]["work"]; badges: Dictionary["cases"]; item: CaseStudy }) {
  const badge = item.kind === "concept" ? badges.conceptBadge : item.kind === "product" ? badges.productBadge : badges.clientBadge;
  return (
    <Link
      href={localePath(locale, `/work/${item.slug}`)}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-2 hover:border-accent/60 hover:shadow-[0_30px_60px_-30px_var(--color-shadow)]"
    >
      <div className="relative flex h-60 items-end justify-center overflow-hidden bg-[linear-gradient(160deg,color-mix(in_oklab,var(--color-accent)_14%,var(--color-bg)),var(--color-bg))] sm:h-72">
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
        {item.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- uploaded covers are already resized WebP
          <img
            src={item.cover}
            alt=""
            loading="lazy"
            decoding="async"
            className="relative h-[86%] max-w-[86%] rounded-t-2xl border border-b-0 border-line object-cover object-top shadow-[0_24px_48px_-24px_var(--color-shadow)] transition-transform duration-700 ease-out-soft group-hover:-translate-y-2 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="relative h-[86%] w-40 rounded-t-[1.6rem] border border-b-0 border-line bg-surface p-2 pb-0 shadow-[0_24px_48px_-24px_var(--color-shadow)] transition-transform duration-700 ease-out-soft group-hover:-translate-y-2 group-hover:scale-[1.04]"
          >
            <div className="flex h-full flex-col gap-2.5 rounded-t-[1.2rem] bg-bg p-3">
              <span className="h-1.5 w-2/5 rounded bg-line-strong" />
              <span className="h-3.5 w-3/4 rounded bg-fg/70" />
              <span className="h-16 rounded-xl border border-accent/60 bg-accent/12" />
              <span className="h-7 rounded-lg bg-surface" />
              <span className="h-7 rounded-lg bg-surface" />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-[0.8rem] text-subtle">
          <span>{item.type}</span>
          {item.kind !== "client" && (
            <span className="rounded-full border border-line px-2 py-0.5 text-[0.7rem]">{badge}</span>
          )}
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-fg sm:text-[1.35rem]">{item.name}</h3>
        <p className="leading-relaxed text-muted">{item.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium text-accent">
          {t.view}
          <Arrow />
        </span>
      </div>
    </Link>
  );
}

/* ───────────────────────── Services ───────────────────────── */

export function ServiceGrid({ locale, t, services }: { locale: Locale; t: Dictionary["home"]["services"]; services: ServiceWithSlug[] }) {
  return (
    <section id="services" aria-labelledby="services-title" className="pb-24 sm:pb-32">
      <div className="container-x">
        <Heading id="services-title" eyebrow={t.eyebrow} title={t.title} />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.slug} data-reveal style={revealDelay((i % 3) * 70)}>
              <Link
                href={localePath(locale, `/services/${service.slug}`)}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-4 transition-[transform,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:border-accent/60 sm:flex-row sm:gap-5 sm:p-6"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-ink sm:size-12">
                  <ServiceIcon name={service.icon} className="size-5.5" />
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="text-[0.95rem] font-semibold leading-snug text-fg sm:text-lg">{service.name}</span>
                  <span className="text-[0.95rem] leading-relaxed text-muted max-sm:hidden">{service.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Process ───────────────────────── */

export function HomeProcess({ t }: { t: Dictionary["home"]["process"] }) {
  return (
    <section id="process" aria-labelledby="process-title" className="border-y border-line bg-surface py-24 sm:py-28">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Heading id="process-title" eyebrow={t.eyebrow} title={t.title} />
          <p className="max-w-sm leading-relaxed text-muted" data-reveal>
            {t.text}
          </p>
        </div>

        <div className="relative mt-14">
          <div aria-hidden="true" className="absolute inset-x-0 top-6 h-0.5 bg-line max-lg:hidden" />
          <div aria-hidden="true" className="draw-line absolute inset-x-0 top-6 h-0.5 bg-accent max-lg:hidden" data-reveal />
          <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((step, i) => (
              <li key={step.title} className="flex gap-5 lg:flex-col" data-reveal style={revealDelay(150 + i * 120)}>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-bg font-mono text-sm text-accent">
                  0{i + 1}
                </span>
                <span className="flex flex-col gap-2 pt-2 lg:pt-0">
                  <span className="text-lg font-semibold text-fg">{step.title}</span>
                  <span className="leading-relaxed text-muted">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Why Keel ───────────────────────── */

export function WhyKeel({ t }: { t: Dictionary["home"]["why"] }) {
  return (
    <section id="why" aria-labelledby="why-title" className="py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Heading id="why-title" eyebrow={t.eyebrow} title={t.title} className="lg:sticky lg:top-32 lg:self-start" />
        <ol className="border-b border-line">
          {t.items.map((item, i) => (
            <li key={item.title} className="flex gap-6 border-t border-line py-7" data-reveal style={revealDelay(i * 90)}>
              <span className="pt-1 font-mono text-sm text-accent">0{i + 1}</span>
              <span>
                <span className="block text-xl font-semibold text-fg">{item.title}</span>
                <span className="mt-2 block leading-relaxed text-muted">{item.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
