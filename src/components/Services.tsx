import Link from "next/link";
import type { Dictionary } from "@/content/dictionaries";
import type { ServiceWithSlug } from "@/content/services";
import { localePath, type Locale } from "@/lib/i18n";
import { revealDelay } from "@/lib/ui";
import { Arrow } from "./ui/Button";
import { ServiceIcon } from "./ui/Icons";
import { SectionHeading } from "./ui/SectionHeading";

type ServicesProps = { locale: Locale; t: Dictionary["services"]; services: ServiceWithSlug[] };

export function Services({ locale, t, services }: ServicesProps) {
  return (
    <section id="services" aria-labelledby="services-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading id="services-title" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.slug} data-reveal style={revealDelay((i % 3) * 80)}>
              <Link
                href={localePath(locale, `/services/${service.slug}`)}
                className="card group flex h-full flex-col p-7 transition-[border-color,transform,background-color] duration-500 ease-out-soft hover:-translate-y-1 hover:border-line-strong sm:p-8"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(28rem_circle_at_0%_0%,rgba(143,180,255,0.08),transparent_60%)]"
                />
                <span className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-bg text-accent">
                    <ServiceIcon name={service.icon} className="size-5.5" />
                  </span>
                  <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                </span>
                <h3 className="mt-10 text-xl font-medium tracking-tight text-fg">{service.name}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{service.summary}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm text-fg/80 transition-colors group-hover:text-fg">
                  {t.more}
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
