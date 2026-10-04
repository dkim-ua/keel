"use client";

import { useRef, useState } from "react";

type ImageUploaderProps = {
  label: string;
  images: string[];
  max: number;
  onChange: (images: string[]) => void;
};

const MAX_SIDE = 2000;

/** Resizes to max 2000px and converts to WebP in the browser, so uploads stay small and fast. */
async function compress(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}

export function ImageUploader({ label, images, max, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const list = [...files].slice(0, Math.max(0, max - images.length) || (max === 1 ? 1 : 0));
    if (!list.length) {
      setError(`Можно загрузить не больше ${max}.`);
      return;
    }
    setBusy(list.length);
    const uploaded: string[] = [];
    for (const original of list) {
      try {
        const file = await compress(original);
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error || `Ошибка ${res.status}`);
        uploaded.push(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Не удалось загрузить файл.");
      } finally {
        setBusy((n) => n - 1);
      }
    }
    if (uploaded.length) onChange(max === 1 ? uploaded.slice(0, 1) : [...images, ...uploaded]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function move(index: number, delta: number) {
    const next = [...images];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-fg">{label}</span>
        <span className="text-xs text-subtle">
          {images.length}/{max}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <figure key={src} className="group relative h-28 w-44 overflow-hidden rounded-xl border border-line bg-bg">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
            <img src={src} alt="" className="size-full object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-bg/85 p-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              {max > 1 && (
                <span className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} className="rounded px-1.5 text-xs text-muted hover:text-fg" aria-label="Левее">
                    ←
                  </button>
                  <button type="button" onClick={() => move(i, 1)} className="rounded px-1.5 text-xs text-muted hover:text-fg" aria-label="Правее">
                    →
                  </button>
                </span>
              )}
              <button type="button" onClick={() => onChange(images.filter((u) => u !== src))} className="ml-auto rounded px-1.5 text-xs text-red-300 hover:text-red-200">
                Убрать
              </button>
            </div>
          </figure>
        ))}
        {(images.length < max || max === 1) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy > 0}
            className="flex h-28 w-44 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line-strong text-sm text-muted transition-colors hover:border-accent/60 hover:text-fg disabled:opacity-60"
          >
            {busy > 0 ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-muted/30 border-t-muted" aria-hidden="true" />
                Загрузка…
              </>
            ) : (
              <>
                <span className="text-xl leading-none">+</span>
                {max === 1 && images.length ? "Заменить" : "Загрузить"}
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple={max > 1}
        hidden
        onChange={(e) => upload(e.target.files)}
      />
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
