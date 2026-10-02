import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({ eyebrow, title, intro, id, align = "left", as = "h2", className = "" }: SectionHeadingProps) {
  const Tag = as;
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`} data-reveal>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <Tag id={id} className={`${as === "h1" ? "text-display" : "text-h2"} font-semibold text-fg`}>
        {title}
      </Tag>
      {intro && <p className={`mt-5 text-base leading-relaxed text-muted sm:text-lg ${centered ? "mx-auto" : ""} max-w-2xl`}>{intro}</p>}
    </div>
  );
}
