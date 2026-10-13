import type { Dictionary } from "@/content/dictionaries";
import { revealDelay } from "@/lib/ui";
import { LogoMark } from "./ui/Logo";

export function Value({ t }: { t: Dictionary["value"] }) {
  const first = t.flow[0];
  const owned = t.flow.slice(1, -1);
  const last = t.flow[t.flow.length - 1];

  return (
    <section aria-labelledby="value-title" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow mb-5">{t.eyebrow}</p>
            <h2 id="value-title" className="text-h2 font-semibold">
              {t.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t.text}</p>
            <p className="mt-8 inline-flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-2 text-sm text-fg">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {t.model}
            </p>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {t.items.map((item, i) => (
              <li key={item.title} className="bg-surface p-7 sm:p-8" data-reveal style={revealDelay(i * 70)}>
                <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                <h3 className="mt-6 text-lg font-medium text-fg">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery chain: the client brings the idea, Keel owns everything in between. */}
        <div className="mt-16 pt-3" data-reveal>
          <ol className="flex flex-wrap items-stretch gap-x-2 gap-y-4 font-mono text-[0.78rem] tracking-wide">
            <li className="flex items-center rounded-xl border border-line px-4 py-3 text-muted">{first}</li>
            <li className="flex items-center text-subtle" aria-hidden="true">→</li>
            <li className="relative rounded-xl border border-accent/40 bg-accent/[0.04] p-1.5">
              <span className="absolute -top-2.5 left-3 flex items-center gap-1.5 bg-bg px-1.5 text-[0.68rem] uppercase tracking-[0.14em] text-accent">
                <LogoMark className="size-3.5" />
                Keel
              </span>
              <ol className="flex flex-wrap items-center gap-1.5">
                {owned.map((step, i) => (
                  <li key={step} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-subtle" aria-hidden="true">→</span>}
                    <span className="rounded-lg bg-surface-2 px-3.5 py-2.5 text-fg">{step}</span>
                  </li>
                ))}
              </ol>
            </li>
            <li className="flex items-center text-subtle" aria-hidden="true">→</li>
            <li className="flex items-center rounded-xl bg-fg px-4 py-3 font-medium text-bg">{last}</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
