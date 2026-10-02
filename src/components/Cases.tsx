import Link from "next/link";
import type { CaseStudy } from "@/content/cases";
import type { Dictionary } from "@/content/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { revealDelay } from "@/lib/ui";
import { Arrow } from "./ui/Button";
import { SectionHeading } from "./ui/SectionHeading";

type CasesProps = {
  locale: Locale;
  t: Dictionary["cases"];
  cases: CaseStudy[];
  headingLevel?: "h1" | "h2";
  id?: string;
};

export function Cases({ locale, t, cases, headingLevel = "h2", id = "cases" }: CasesProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading id={`${id}-title`} as={headingLevel} eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

        <ul className="mt-14 grid gap-4 lg:grid-cols-3">
          {cases.map((item, i) => (
            <li key={item.slug} data-reveal style={revealDelay(i * 80)}>
              <CaseCard locale={locale} t={t} item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CaseCard({ locale, t, item }: { locale: Locale; t: Dictionary["cases"]; item: CaseStudy }) {
  const concept = item.kind === "concept";
  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <CasePreview variant={item.preview} />
      <div className="flex flex-1 flex-col p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-wider ${
              concept ? "border-line-strong text-muted" : "border-signal/40 text-signal"
            }`}
          >
            {concept ? t.conceptBadge : t.clientBadge}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-medium tracking-tight text-fg">{item.name}</h3>
        <p className="mt-1 text-sm text-subtle">
          <span className="sr-only">{t.type}: </span>
          {item.type}
        </p>
        <p className="mt-4 leading-relaxed text-muted">{item.summary}</p>

        <dl className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
          <div>
            <dt className="font-mono text-[0.68rem] uppercase tracking-wider text-subtle">{t.stack}</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {item.stack.map((tech) => (
                <span key={tech} className="rounded-md bg-surface-2 px-2 py-1 text-xs text-muted">
                  {tech}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] uppercase tracking-wider text-subtle">
              {concept ? t.conceptOutcome : t.clientOutcome}
            </dt>
            <dd className="mt-1.5 leading-relaxed text-muted">{item.outcome}</dd>
          </div>
        </dl>

        <Link
          href={localePath(locale, `/work/${item.slug}`)}
          className="mt-auto inline-flex items-center gap-2 pt-7 text-sm text-fg/85 transition-colors hover:text-fg"
        >
          {concept ? t.view : t.viewClient}
          <span className="sr-only">: {item.name}</span>
          <Arrow />
        </Link>
      </div>
    </article>
  );
}

/** Abstract, deterministic preview per case — no screenshots or stock imagery. */
function CasePreview({ variant }: { variant: CaseStudy["preview"] }) {
  return (
    <div aria-hidden="true" className="relative h-40 overflow-hidden border-b border-line bg-bg">
      <div className="bg-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="absolute inset-x-6 bottom-0 top-6 rounded-t-lg border border-b-0 border-line-strong bg-surface/80 p-3 transition-transform duration-700 ease-out-soft group-hover:-translate-y-1.5">
        <div className="flex gap-1.5">
          <span className="h-1.5 w-8 rounded-full bg-line-strong" />
          <span className="h-1.5 w-5 rounded-full bg-line" />
        </div>
        {variant === "board" && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((c) => (
              <div key={c} className="space-y-1.5">
                <span className="block h-1.5 w-10 rounded-full bg-line-strong" />
                {Array.from({ length: 3 - c }).map((_, r) => (
                  <span key={r} className={`block h-6 rounded-md border border-line ${r === 0 && c === 1 ? "bg-accent/15" : "bg-surface-2"}`} />
                ))}
              </div>
            ))}
          </div>
        )}
        {variant === "chart" && (
          <div className="mt-3 flex h-[5.5rem] items-end gap-1.5">
            {[38, 52, 44, 66, 58, 74, 62, 82, 70, 90].map((h, i) => (
              <span key={i} className={`flex-1 rounded-sm ${i === 9 ? "bg-accent/60" : "bg-line-strong"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        )}
        {variant === "chat" && (
          <div className="mt-3 space-y-2">
            <span className="ml-auto block h-5 w-2/5 rounded-md bg-line-strong" />
            <span className="block h-9 w-4/5 rounded-md border border-line bg-surface-2" />
            <span className="flex gap-1.5">
              <span className="h-3.5 w-14 rounded border border-accent/40 bg-accent/10" />
              <span className="h-3.5 w-10 rounded border border-line" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
