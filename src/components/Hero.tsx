import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { revealDelay } from "@/lib/ui";
import { ButtonLink } from "./ui/Button";
import { ArchitectureVisual } from "./visuals/ArchitectureVisual";

type HeroProps = { locale: Locale; t: Dictionary["hero"] };

export function Hero({ t }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-12 pt-28 sm:pt-36 lg:pb-16 lg:pt-40">
      {/* Background: drifting hairline grid + soft top glow */}
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-10 animate-drift opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_30%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[-18rem] -z-10 h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(92,132,220,0.22),transparent)]"
      />

      <div className="container-x">
        <p className="eyebrow mb-7" data-reveal>
          {t.eyebrow}
        </p>
        <h1 id="hero-title" className="text-display font-semibold" data-reveal style={revealDelay(60)}>
          <span className="block text-fg">{t.titleLine1}</span>
          <span className="text-gradient block pb-[0.08em]">{t.titleLine2}</span>
        </h1>

        <div className="mt-10 grid items-start gap-14 lg:mt-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl lg:pt-6" data-reveal style={revealDelay(120)}>
              {t.subtitle}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" data-reveal style={revealDelay(180)}>
              <ButtonLink href="#contact" size="lg" arrow>
                {t.primaryCta}
              </ButtonLink>
              <ButtonLink href="#process" size="lg" variant="secondary">
                {t.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <div data-reveal style={revealDelay(220)}>
            <ArchitectureVisual label={t.visualLabel} />
          </div>
        </div>
      </div>

      <div className="container-x mt-16 lg:mt-24" data-reveal>
        <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.78rem] tracking-wide text-muted">
            {t.capabilities.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && <span className="size-1 rounded-full bg-line-strong" aria-hidden="true" />}
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-subtle">{t.tagline}</p>
        </div>
      </div>
    </section>
  );
}
