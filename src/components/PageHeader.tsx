import Link from "next/link";
import type { ReactNode } from "react";
import { revealDelay } from "@/lib/ui";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: string;
  intro?: string;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, intro, breadcrumbs, children }: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_70%_70%_at_30%_0%,#000_20%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[10%] top-[-16rem] -z-10 h-[30rem] w-[50rem] rounded-full bg-[radial-gradient(closest-side,rgba(92,132,220,0.18),transparent)]"
      />
      <div className="container-x">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-10" data-reveal>
            <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-subtle">
              {breadcrumbs.map((crumb, i) => (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-fg">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-muted">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <div className="eyebrow mb-6" data-reveal>
            {eyebrow}
          </div>
        )}
        <h1 className="max-w-4xl text-[clamp(2.4rem,1.2rem+4.4vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]" data-reveal style={revealDelay(60)}>
          {title}
        </h1>
        {intro && (
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl" data-reveal style={revealDelay(120)}>
            {intro}
          </p>
        )}
        {children && (
          <div className="mt-10" data-reveal style={revealDelay(180)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
