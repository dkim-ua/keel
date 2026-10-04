"use client";

import { useActionState, useState, type ReactNode } from "react";
import { saveCaseAction, type FormState } from "@/app/admin/actions";
import { buttonClasses } from "@/components/ui/Button";
import { caseKinds, casePreviews, type CaseKind } from "@/content/cases";
import { kindLabels } from "@/lib/admin/labels";
import { localeLabels, locales, type Locale } from "@/lib/i18n";
import { ImageUploader } from "./ImageUploader";

type TextValues = {
  name: string;
  type: string;
  summary: string;
  outcome: string;
  challenge: string;
  solution: string;
  architecture: string;
  scope: string;
};

export type CaseEditorValues = {
  id: string;
  slug: string;
  kind: CaseKind;
  preview: string;
  published: boolean;
  link: string;
  stack: string;
  cover: string;
  gallery: string[];
  texts: Record<Locale, TextValues>;
};

const input =
  "block w-full rounded-xl border border-line bg-bg/70 px-4 py-2.5 text-sm text-fg placeholder:text-subtle/80 focus:border-accent/70 focus:outline-none focus:ring-2 focus:ring-accent/20";

const previewLabels: Record<string, string> = { board: "Доска задач", chart: "График", chat: "Чат" };

export function CaseEditor({ initial, uploadsEnabled }: { initial: CaseEditorValues; uploadsEnabled: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCaseAction, undefined);
  const [lang, setLang] = useState<Locale>("en");
  const [cover, setCover] = useState(initial.cover);
  const [gallery, setGallery] = useState<string[]>(initial.gallery);
  const [kind, setKind] = useState<CaseKind>(initial.kind);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={initial.id} />
      <input type="hidden" name="cover" value={cover} />
      <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />

      {/* ── Settings ── */}
      <Section title="Основное">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Тип проекта">
            <select name="kind" value={kind} onChange={(e) => setKind(e.target.value as CaseKind)} className={input}>
              {caseKinds.map((k) => (
                <option key={k} value={k}>
                  {kindLabels[k]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Адрес страницы" hint="Только латиница и дефисы. Пусто — создастся из названия.">
            <div className="flex items-center rounded-xl border border-line bg-bg/70 pl-3 text-sm text-subtle focus-within:border-accent/70">
              /work/
              <input name="slug" defaultValue={initial.slug} placeholder="my-project" className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-fg focus:outline-none" />
            </div>
          </Field>
          <Field label="Технологии" hint="Через запятую: Next.js, Node.js, PostgreSQL">
            <input name="stack" defaultValue={initial.stack} className={input} />
          </Field>
          <Field label="Ссылка на проект" hint="Необязательно. Покажется кнопкой «Visit product».">
            <input name="link" type="url" defaultValue={initial.link} placeholder="https://" className={input} />
          </Field>
        </div>
        <label className="mt-5 flex items-center gap-3 text-sm text-fg">
          <input type="checkbox" name="published" defaultChecked={initial.published} className="size-4 accent-[#8fb4ff]" />
          Показывать на сайте
        </label>
        {kind === "client" && (
          <p className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/[0.06] p-3 text-xs leading-relaxed text-amber-100">
            Клиентский проект: указывайте только реальные результаты и только с согласия клиента.
          </p>
        )}
        {kind === "concept" && (
          <p className="mt-4 text-xs text-subtle">На сайте будет пометка «Concept / Internal Project» и предупреждение, что это не клиентская работа.</p>
        )}
      </Section>

      {/* ── Images ── */}
      <Section title="Картинки" description="Обложка — для карточки и верха страницы. Скриншоты — галерея на странице кейса. Картинки автоматически сжимаются.">
        {uploadsEnabled ? (
          <div className="space-y-6">
            <ImageUploader label="Обложка" images={cover ? [cover] : []} max={1} onChange={(list) => setCover(list[0] ?? "")} />
            <ImageUploader label="Скриншоты" images={gallery} max={12} onChange={setGallery} />
          </div>
        ) : (
          <p className="text-sm text-muted">Подключите Vercel Blob, чтобы загружать картинки (инструкция вверху страницы).</p>
        )}
        {!cover && (
          <Field label="Заставка без обложки" className="mt-5 max-w-xs">
            <select name="preview" defaultValue={initial.preview} className={input}>
              {casePreviews.map((p) => (
                <option key={p} value={p}>
                  {previewLabels[p]}
                </option>
              ))}
            </select>
          </Field>
        )}
        {cover && <input type="hidden" name="preview" value={initial.preview} />}
      </Section>

      {/* ── Texts ── */}
      <Section
        title="Тексты"
        description="Английская версия обязательна. Если украинскую не заполнить, на /uk будет показан английский текст."
        aside={
          <div className="flex gap-1 rounded-full border border-line p-1" role="tablist" aria-label="Язык">
            {locales.map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={lang === l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3.5 py-1 text-sm ${lang === l ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
              >
                {localeLabels[l]}
              </button>
            ))}
          </div>
        }
      >
        {locales.map((l) => {
          const t = initial.texts[l];
          const required = l === "en";
          return (
            <div key={l} hidden={lang !== l} className="grid gap-4 sm:grid-cols-2">
              <Field label={`Название${required ? " *" : ""}`}>
                <input name={`${l}.name`} defaultValue={t.name} maxLength={120} className={input} />
              </Field>
              <Field label="Категория" hint="Например: SaaS · Web, Mobile, AI Solution">
                <input name={`${l}.type`} defaultValue={t.type} maxLength={120} className={input} />
              </Field>
              <Field label={`Краткое описание${required ? " *" : ""}`} hint="1–2 предложения для карточки" className="sm:col-span-2">
                <textarea name={`${l}.summary`} defaultValue={t.summary} rows={2} maxLength={600} className={input} />
              </Field>
              <Field label={kind === "concept" ? "Фокус концепта" : "Результат"} className="sm:col-span-2">
                <textarea name={`${l}.outcome`} defaultValue={t.outcome} rows={2} maxLength={600} className={input} />
              </Field>
              <Field label="Задача" hint="Какую проблему решали">
                <textarea name={`${l}.challenge`} defaultValue={t.challenge} rows={5} className={input} />
              </Field>
              <Field label="Решение" hint="Что сделали">
                <textarea name={`${l}.solution`} defaultValue={t.solution} rows={5} className={input} />
              </Field>
              <Field label="Архитектура" hint="Каждый блок с новой строки: «Название — описание»">
                <textarea name={`${l}.architecture`} defaultValue={t.architecture} rows={5} placeholder={"Web app — Next.js dashboard\nAPI — Node.js service"} className={`${input} font-mono text-xs`} />
              </Field>
              <Field label="Что входит" hint="Каждый пункт с новой строки">
                <textarea name={`${l}.scope`} defaultValue={t.scope} rows={5} className={input} />
              </Field>
            </div>
          );
        })}
      </Section>

      <div className="sticky bottom-0 -mx-5 flex flex-col gap-3 border-t border-line bg-bg/90 px-5 py-4 backdrop-blur sm:-mx-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div role="alert" className="text-sm text-red-300">
          {state?.error}
        </div>
        <button type="submit" disabled={pending} className={buttonClasses("primary", "lg")}>
          {pending ? "Сохраняем…" : "Сохранить и опубликовать"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, description, aside, children }: { title: string; description?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-medium text-fg">{title}</h2>
          {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, className = "", children }: { label: string; hint?: string; className?: string; children: ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-subtle">{hint}</span>}
    </label>
  );
}
