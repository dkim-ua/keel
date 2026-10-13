"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Labels = { gallery: string; close: string; prev: string; next: string };

/**
 * Case screenshots as a horizontal strip of fixed height: phone screens sit
 * side by side, wide screenshots keep their proportions. Swipe on touch,
 * arrow buttons on desktop, click to open full size.
 */
export function CaseGallery({ images, name, labels }: { images: string[]; name: string; labels: Labels }) {
  const strip = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const updateEdges = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const scrollBy = (dir: 1 | -1) => strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.8, behavior: "smooth" });
  const step = (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length));

  const arrow = "flex size-11 items-center justify-center rounded-full border border-line-strong bg-surface text-fg transition-[opacity,border-color] hover:border-muted disabled:opacity-30";

  return (
    <section aria-label={labels.gallery} className="pb-8">
      <div className="relative">
        <ul
          ref={strip}
          onScroll={updateEdges}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:px-[max(2rem,calc((100vw-76rem)/2+2rem))]"
        >
          {images.map((src, i) => (
            <li key={`${src}-${i}`} className="shrink-0 snap-start" data-reveal>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group block h-[24rem] overflow-hidden rounded-2xl border border-line bg-surface sm:h-[28rem] lg:h-[32rem]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- uploaded images are already resized to WebP */}
                <img
                  src={src}
                  alt={`${name} — ${i + 1}`}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                  onLoad={updateEdges}
                  className="h-full w-auto max-w-[85vw] object-cover object-top transition-transform duration-700 ease-out-soft group-hover:scale-[1.02] lg:max-w-[60rem]"
                />
              </button>
            </li>
          ))}
        </ul>

        {!(edges.start && edges.end) && (
          <div className="container-x mt-5 flex justify-end gap-2 max-sm:hidden">
            <button type="button" className={arrow} onClick={() => scrollBy(-1)} disabled={edges.start} aria-label={labels.prev}>
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 8H3M7 4 3 8l4 4" />
              </svg>
            </button>
            <button type="button" className={arrow} onClick={() => scrollBy(1)} disabled={edges.end} aria-label={labels.next}>
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        {open !== null && (
          <div className="flex h-[100dvh] w-screen items-center justify-center p-4 sm:p-10" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- full-size view of an uploaded image */}
            <img src={images[open]} alt={`${name} — ${open + 1}`} className="max-h-full max-w-full rounded-xl object-contain" />
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={labels.close}
              className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 3l10 10M13 3 3 13" />
              </svg>
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={labels.prev}
                  className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={labels.next}
                  className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  ›
                </button>
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-white/70">
                  {open + 1} / {images.length}
                </p>
              </>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
