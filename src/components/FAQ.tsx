import { revealDelay } from "@/lib/ui";
import { SectionHeading } from "./ui/SectionHeading";

type FAQProps = {
  eyebrow?: string;
  title: string;
  items: { question: string; answer: string }[];
  id?: string;
};

/** Native <details> — accessible, works without JS and keeps answers indexable. */
export function FAQ({ eyebrow, title, items, id = "faq" }: FAQProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} className="lg:sticky lg:top-32 lg:self-start" />

        <div className="border-t border-line">
          {items.map((item, i) => (
            <details key={item.question} className="group border-b border-line" data-reveal style={revealDelay(i * 40)}>
              <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 text-left text-[1.05rem] font-medium text-fg transition-colors hover:text-accent-strong sm:text-lg">
                <h3>{item.question}</h3>
                <span
                  aria-hidden="true"
                  className="relative mt-1.5 size-4 shrink-0 text-muted transition-transform duration-300 ease-out-soft group-open:rotate-45"
                >
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
                </span>
              </summary>
              <p className="-mt-1 max-w-2xl pb-7 pr-10 leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
