import type { Dictionary } from "@/content/dictionaries";
import { revealDelay } from "@/lib/ui";
import { SectionHeading } from "./ui/SectionHeading";

export function WhyUs({ t }: { t: Dictionary["why"] }) {
  return (
    <section id="why" aria-labelledby="why-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading id="why-title" eyebrow={t.eyebrow} title={t.title} className="lg:sticky lg:top-32 lg:self-start" />

        <ol className="border-t border-line">
          {t.items.map((item, i) => (
            <li
              key={item.title}
              className="group grid gap-2 border-b border-line py-7 sm:grid-cols-[2.5rem_0.9fr_1.1fr] sm:gap-6 sm:py-8"
              data-reveal
              style={revealDelay(i * 60)}
            >
              <span className="font-mono text-xs text-subtle transition-colors group-hover:text-accent sm:pt-1.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-medium text-fg sm:text-xl">{item.title}</h3>
              <p className="leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
