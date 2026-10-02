import type { Dictionary } from "@/content/dictionaries";
import type { ProjectType } from "@/lib/contact/options";
import type { Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { ContactForm } from "./ContactForm";

type CTAProps = {
  locale: Locale;
  t: Dictionary["cta"];
  form: Dictionary["form"];
  /** Service pages override the headline. */
  title?: string;
  text?: string;
  defaultProjectType?: ProjectType;
  id?: string;
};

/** Final call to action with the project request form. */
export function CTA({ locale, t, form, title, text, defaultProjectType, id = "contact" }: CTAProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative isolate overflow-clip border-t border-line py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute bottom-[-20rem] left-[-10rem] -z-10 h-[40rem] w-[50rem] rounded-full bg-[radial-gradient(closest-side,rgba(92,132,220,0.16),transparent)]"
      />
      <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start" data-reveal>
          <p className="eyebrow mb-5">{t.eyebrow}</p>
          <h2 id={`${id}-title`} className="text-h2 font-semibold">
            {title ?? t.title}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{text ?? t.text}</p>

          <div className="mt-12">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">{t.nextTitle}</p>
            <ol className="mt-5 space-y-5">
              {t.next.map((step, i) => (
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
          </div>

          {siteConfig.email && (
            <p className="mt-12 text-sm text-muted">
              {t.emailLabel}{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                {siteConfig.email}
              </a>
            </p>
          )}
        </div>

        <div data-reveal>
          <ContactForm locale={locale} t={form} defaultProjectType={defaultProjectType} idPrefix={id} />
        </div>
      </div>
    </section>
  );
}
