"use client";

import { useRef, type ReactNode } from "react";

/**
 * Wraps the hero and feeds the pointer position to CSS (--mx / --my, −0.5…0.5).
 * Children with the `.parallax` class move against it; touch screens and
 * reduced-motion users simply see a still picture.
 */
export function HeroStage({ children, className = "", labelledBy }: { children: ReactNode; className?: string; labelledBy: string }) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const set = (x: number, y: number) => {
    cancelAnimationFrame(frame.current ?? 0);
    frame.current = requestAnimationFrame(() => {
      ref.current?.style.setProperty("--mx", x.toFixed(3));
      ref.current?.style.setProperty("--my", y.toFixed(3));
    });
  };

  return (
    <section
      ref={ref}
      aria-labelledby={labelledBy}
      className={className}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const r = e.currentTarget.getBoundingClientRect();
        set((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => set(0, 0)}
    >
      {children}
    </section>
  );
}
