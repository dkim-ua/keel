import type { Dictionary } from "@/content/dictionaries";
import { revealDelay } from "@/lib/ui";
import { ButtonLink } from "./ui/Button";
import { SectionHeading } from "./ui/SectionHeading";

type ProcessProps = {
  t: Dictionary["process"];
  /** Section title override (service pages use a shorter heading). */
  title?: string;
  showIntro?: boolean;
  estimateHref?: string;
  id?: string;
};

export function Process({ t, title, showIntro = true, estimateHref, id = "process" }: ProcessProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading id={`${id}-title`} eyebrow={t.eyebrow} title={title ?? t.title} intro={showIntro ? t.intro : undefined} />

        <div className="relative mt-16">
          {/* desktop rail */}
          <span aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-gradient-to-r from-accent/70 via-line-strong to-line lg:block" />
        <ol className="grid gap-0 lg:grid-cols-6 lg:gap-6">
          {t.steps.map((step, i) => (
            <li
              key={step.title}
              className="group relative grid grid-cols-[2rem_1fr] gap-x-4 pb-10 last:pb-0 lg:block lg:pb-0"
              data-reveal
              style={revealDelay(i * 70)}
            >
              {/* mobile rail */}
              <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-4 w-px bg-line-strong lg:hidden group-last:hidden" />
              <span
                aria-hidden="true"
                className={`relative z-10 mt-0.5 block size-[15px] rounded-full border bg-bg ${
                  i === 0 ? "border-accent" : "border-line-strong"
                }`}
              >
                <span className={`absolute inset-[4px] rounded-full ${i === 0 ? "bg-accent" : "bg-line-strong"}`} />
              </span>
              <div className="lg:mt-8">
                <span className="font-mono text-xs tracking-wider text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-medium text-fg">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        </div>

        {estimateHref && (
          <div
            className="card mt-16 flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8"
            data-reveal
          >
            <div>
              <h3 className="text-lg font-medium text-fg">{t.estimateTitle}</h3>
              <p className="mt-1.5 text-muted">{t.estimateText}</p>
            </div>
            <ButtonLink href={estimateHref} variant="secondary" size="lg" arrow className="shrink-0">
              {t.estimateCta}
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
