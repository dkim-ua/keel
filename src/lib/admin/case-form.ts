import { caseKinds, casePreviews, type CaseKind, type CaseRecord, type CaseText } from "@/content/cases";
import { locales, type Locale } from "../i18n";

/** Converts the admin case form into a CaseRecord. Kept separate from actions so it is easy to test. */

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(form: FormData, name: string, max = 4000): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((l) => l.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);
}

/** "Name — description" (also accepts ":" or "-" as separator). */
export function parseArchitecture(value: string): { name: string; text: string }[] {
  return lines(value).map((line) => {
    const match = line.match(/^(.+?)\s+[—–-]\s+(.+)$/) ?? line.match(/^([^:]+):\s*(.+)$/);
    return match ? { name: match[1].trim(), text: match[2].trim() } : { name: line, text: "" };
  });
}

export function formatArchitecture(items: { name: string; text: string }[]): string {
  return items.map((i) => (i.text ? `${i.name} — ${i.text}` : i.name)).join("\n");
}

function urlOrEmpty(value: string): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export type ParsedCase = { ok: true; record: CaseRecord } | { ok: false; error: string };

export function parseCaseForm(form: FormData, ctx: { existing: CaseRecord[]; nextOrder: number }): ParsedCase {
  const id = text(form, "id", 80);
  const current = ctx.existing.find((c) => c.id === id);

  const texts = {} as Record<Locale, CaseText>;
  for (const l of locales) {
    texts[l] = {
      name: text(form, `${l}.name`, 120),
      type: text(form, `${l}.type`, 120),
      summary: text(form, `${l}.summary`, 600),
      outcome: text(form, `${l}.outcome`, 600),
      challenge: text(form, `${l}.challenge`),
      solution: text(form, `${l}.solution`),
      architecture: parseArchitecture(text(form, `${l}.architecture`)),
      scope: lines(text(form, `${l}.scope`)),
    };
  }
  if (!texts.en.name) return { ok: false, error: "Укажите название проекта на английском (EN)." };
  if (!texts.en.summary) return { ok: false, error: "Добавьте краткое описание на английском (EN)." };

  const slug = text(form, "slug", 60) || slugify(texts.en.name);
  if (!SLUG_RE.test(slug)) return { ok: false, error: "Адрес (slug) может содержать только латиницу, цифры и дефисы." };
  if (ctx.existing.some((c) => c.slug === slug && c.id !== id)) {
    return { ok: false, error: `Кейс с адресом «${slug}» уже существует.` };
  }

  const kindRaw = text(form, "kind", 20);
  const kind: CaseKind = (caseKinds as readonly string[]).includes(kindRaw) ? (kindRaw as CaseKind) : "product";
  const previewRaw = text(form, "preview", 20);
  const preview = (casePreviews as readonly string[]).includes(previewRaw) ? (previewRaw as CaseRecord["preview"]) : "board";

  let gallery: string[] = [];
  try {
    const raw = JSON.parse(text(form, "gallery", 20_000) || "[]");
    if (Array.isArray(raw)) gallery = raw.map((u) => urlOrEmpty(String(u))).filter(Boolean).slice(0, 12);
  } catch {
    gallery = [];
  }

  const record: CaseRecord = {
    id: current?.id ?? (id || `${slug}-${Date.now().toString(36)}`),
    slug,
    kind,
    preview,
    published: form.get("published") === "on",
    order: current?.order ?? ctx.nextOrder,
    stack: text(form, "stack", 600)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20),
    cover: urlOrEmpty(text(form, "cover", 1000)) || undefined,
    gallery,
    link: urlOrEmpty(text(form, "link", 500)) || undefined,
    ...texts,
  };
  return { ok: true, record };
}
