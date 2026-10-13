import type { CSSProperties } from "react";
import type { CaseStudy } from "@/content/cases";
import type { Dictionary } from "@/content/dictionaries";
import { ButtonLink } from "../ui/Button";
import { HeroStage } from "./HeroStage";

type HomeHeroProps = {
  hero: Dictionary["hero"];
  home: Dictionary["home"];
  /** Featured cases: the first one with a cover appears inside the phone mockup. */
  featured: CaseStudy[];
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const px = (x: number, y: number) => ({ "--px": `${x}px`, "--py": `${y}px` }) as CSSProperties;

/** Splits a headline line into words that slide up one after another. */
function Words({ text, start, accent = false }: { text: string; start: number; accent?: boolean }) {
  return (
    <span className={`block ${accent ? "text-accent" : ""}`}>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          {i > 0 && " "}
          <span className="word">
            <span style={d(start + i * 80)}>{word}</span>
          </span>
        </span>
      ))}
    </span>
  );
}

export function HomeHero({ hero, home, featured }: HomeHeroProps) {
  const cover = featured.find((c) => c.cover)?.cover;

  return (
    <HeroStage labelledBy="hero-title" className="relative isolate overflow-hidden pb-20 pt-28 sm:pt-36 lg:pb-28 lg:pt-40">
      {/* Background: drifting light + hairline grid */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="orb absolute -right-32 -top-56 size-[40rem] rounded-full bg-[radial-gradient(closest-side,var(--color-glow),transparent)]" />
        <div
          className="orb absolute -bottom-72 -left-40 size-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--color-glow-2),transparent)]"
          style={{ animationDelay: "-9s" }}
        />
        <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_60%_40%,#000_10%,transparent_70%)]" />
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
        <div>
          <p
            className="rise-in mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 px-3.5 py-2 text-[0.8rem] text-muted"
            style={d(0)}
          >
            <span className="size-2 animate-pulse-soft rounded-full bg-accent" aria-hidden="true" />
            {hero.eyebrow} · {home.badge}
          </p>

          <h1 id="hero-title" className="hero-title font-semibold">
            <Words text={hero.titleLine1} start={60} />
            <Words text={hero.titleLine2} start={220} accent />
          </h1>

          <p className="rise-in mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl" style={d(420)}>
            {home.heroSubtitle}
          </p>

          <div className="rise-in mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={d(520)}>
            <ButtonLink href="#contact" size="lg" arrow>
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink href="#cases" size="lg" variant="secondary">
              {home.heroSecondary}
            </ButtonLink>
          </div>

          <ul className="rise-in mt-12 flex flex-wrap gap-x-7 gap-y-2 text-sm text-subtle" style={d(640)}>
            {home.capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Product mockups: a browser window, a phone and a status chip. */}
        <div aria-hidden="true" className="relative mx-auto h-[25rem] w-full max-w-[34rem] sm:h-[31rem]">
          <div className="parallax absolute left-0 right-10 top-4" style={px(-18, -14)}>
            <div className="rise-in" style={d(300)}>
              <div className="float-a overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-30px_var(--color-shadow)]">
                <div className="flex items-center gap-1.5 border-b border-line px-3.5 py-3">
                  <span className="size-2.5 rounded-full bg-line-strong" />
                  <span className="size-2.5 rounded-full bg-line-strong" />
                  <span className="size-2.5 rounded-full bg-line-strong" />
                  <span className="ml-3 h-2.5 w-36 rounded-md bg-surface-2 ring-1 ring-line" />
                </div>
                <div className="grid min-h-60 grid-cols-[6.5rem_1fr] sm:min-h-72">
                  <div className="flex flex-col gap-3 border-r border-line p-4">
                    <span className="h-2.5 w-3/4 rounded bg-accent" />
                    <span className="h-2 w-4/5 rounded bg-line-strong" />
                    <span className="h-2 w-3/5 rounded bg-line-strong" />
                    <span className="h-2 w-3/4 rounded bg-line-strong" />
                  </div>
                  <div className="flex flex-col gap-4 p-4 sm:p-5">
                    <div className="grid grid-cols-3 gap-2.5">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className={`rounded-lg p-2.5 ${i === 2 ? "bg-accent/12" : "bg-bg"}`}>
                          <span className="block h-1.5 w-1/2 rounded bg-line-strong" />
                          <span className={`mt-2.5 block h-3 w-2/3 rounded ${i === 2 ? "bg-accent" : "bg-fg/70"}`} />
                        </div>
                      ))}
                    </div>
                    <div className="flex h-28 items-end gap-2 rounded-xl bg-bg p-3 sm:h-36">
                      {[35, 55, 45, 70, 60, 85, 75, 95].map((h, i) => (
                        <span
                          key={i}
                          className={`bar-grow flex-1 rounded-sm ${i === 5 || i === 7 ? "bg-accent" : "bg-line-strong"}`}
                          style={{ height: `${h}%`, ...d(600 + i * 60) }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="parallax absolute bottom-0 right-0 w-40 sm:w-48" style={px(28, 22)}>
            <div className="rise-in" style={d(460)}>
              <div className="float-b rounded-[2rem] border border-line bg-surface p-2.5 shadow-[0_30px_60px_-30px_var(--color-shadow)]">
                <div className="relative h-72 overflow-hidden rounded-[1.5rem] bg-bg sm:h-80">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element -- uploaded covers are already resized WebP
                    <img src={cover} alt="" className="size-full object-cover object-top" />
                  ) : (
                    <div className="flex h-full flex-col gap-3 p-4">
                      <span className="mx-auto h-1.5 w-12 rounded bg-line-strong" />
                      <span className="mt-2 h-2 w-1/2 rounded bg-subtle/50" />
                      <span className="h-5 w-3/4 rounded bg-fg/80" />
                      <span className="h-20 rounded-xl border border-accent/60 bg-accent/12" />
                      <span className="flex gap-2">
                        <span className="h-10 flex-1 rounded-xl bg-surface" />
                        <span className="h-10 flex-1 rounded-xl bg-surface" />
                      </span>
                      <span className="mt-auto h-9 rounded-full bg-accent" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="parallax absolute -left-2 bottom-12 sm:-left-6" style={px(40, 30)}>
            <div className="rise-in" style={d(760)}>
              <div className="float-b flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-[0.8rem] shadow-[0_24px_48px_-24px_var(--color-shadow)]" style={{ animationDelay: "-2s" }}>
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent/12 text-accent">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <span className="block font-semibold text-fg">{home.heroChipTitle}</span>
                  <span className="text-subtle">{home.heroChipText}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroStage>
  );
}
