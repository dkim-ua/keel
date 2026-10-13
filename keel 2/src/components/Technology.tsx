import { revealDelay } from "@/lib/ui";
import { SectionHeading } from "./ui/SectionHeading";

type TechnologyProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  note?: string;
  noteText?: string;
  categories: { name: string; items: string[] }[];
  id?: string;
};

export function Technology({ eyebrow, title, subtitle, note, noteText, categories, id = "technology" }: TechnologyProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} intro={subtitle} />
          {note && (
            <div className="max-w-sm rounded-2xl border border-line bg-surface p-6" data-reveal>
              <p className="flex items-center gap-2.5 font-medium text-fg">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                {note}
              </p>
              {noteText && <p className="mt-2 text-sm leading-relaxed text-muted">{noteText}</p>}
            </div>
          )}
        </div>

        <dl
          className={`mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 ${
            categories.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          }`}
        >
          {categories.map((category, i) => (
            <div key={category.name} className="bg-surface p-6 sm:p-7" data-reveal style={revealDelay((i % 4) * 60)}>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">{category.name}</dt>
              <dd className="mt-4 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span key={item} className="rounded-lg border border-line bg-bg px-3 py-1.5 text-sm text-fg/90">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
