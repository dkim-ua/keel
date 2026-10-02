"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Dictionary } from "@/content/dictionaries";
import { budgets, projectStages, projectTypes, type ProjectType } from "@/lib/contact/options";
import type { Locale } from "@/lib/i18n";
import { Arrow, buttonClasses } from "./ui/Button";
import { CheckIcon } from "./ui/Icons";

type FieldName = "name" | "company" | "email" | "contact" | "projectType" | "stage" | "budget" | "description";
type ErrorCode = "required" | "invalid" | "tooLong";
type Status = "idle" | "submitting" | "success" | "error";
type ApiErrorCode = keyof Dictionary["form"]["errors"];

type ContactFormProps = {
  locale: Locale;
  t: Dictionary["form"];
  defaultProjectType?: ProjectType;
  /** Unique prefix when several forms could exist on one page. */
  idPrefix?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REQUIRED: FieldName[] = ["name", "email", "projectType", "stage", "budget", "description"];

/**
 * Real lead form.
 * - With JS: posts JSON to /api/contact and shows the server's result.
 * - Without JS: the native form posts to the same endpoint and is redirected
 *   to a thank-you / error page.
 * Success is shown ONLY after the API confirms delivery.
 */
export function ContactForm({ locale, t, defaultProjectType, idPrefix = "cf" }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<FieldName, ErrorCode>>>({});
  const [apiError, setApiError] = useState<ApiErrorCode | null>(null);
  const [startedAt, setStartedAt] = useState(0);

  useEffect(() => setStartedAt(Date.now()), []);

  const id = (name: string) => `${idPrefix}-${name}`;

  function validate(data: Record<string, string>) {
    const next: Partial<Record<FieldName, ErrorCode>> = {};
    for (const field of REQUIRED) if (!data[field]?.trim()) next[field] = "required";
    if (data.email && !EMAIL_RE.test(data.email.trim())) next.email = "invalid";
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    // We take over the submission to send JSON and show inline feedback.
    // The request below is real; success is displayed only on a 2xx response.
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const clientErrors = validate(data);
    setErrors(clientErrors);
    setApiError(null);
    if (Object.keys(clientErrors).length) {
      focusFirstError(clientErrors);
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, sourcePage: window.location.pathname }),
      });
      const result = (await response.json().catch(() => null)) as
        | { ok: true; id?: string }
        | { ok: false; error?: string; fields?: Partial<Record<FieldName, ErrorCode>> }
        | null;

      if (response.ok && result?.ok) {
        setStatus("success");
        form.reset();
        requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }

      if (result && !result.ok && result.fields) {
        setErrors(result.fields);
        focusFirstError(result.fields);
      }
      const code = (result && !result.ok && result.error) || "generic";
      setApiError(code === "validation" ? "summary" : code in t.errors ? (code as ApiErrorCode) : "generic");
      setStatus("error");
    } catch {
      setApiError("network");
      setStatus("error");
    }
  }

  function focusFirstError(errs: Partial<Record<FieldName, ErrorCode>>) {
    const order: FieldName[] = ["name", "company", "email", "contact", "projectType", "stage", "budget", "description"];
    const first = order.find((f) => errs[f]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
  }

  if (status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="card flex min-h-[28rem] flex-col items-center justify-center p-10 text-center outline-none"
      >
        <span className="flex size-14 items-center justify-center rounded-full border border-signal/40 bg-signal/10 text-signal">
          <CheckIcon className="size-6" />
        </span>
        <p className="mt-6 text-2xl font-semibold text-fg">{t.successTitle}</p>
        <p className="mt-2 text-lg text-muted">{t.successText}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setStartedAt(Date.now());
          }}
          className="mt-8 text-sm text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg"
        >
          {t.successAgain}
        </button>
      </div>
    );
  }

  const errorText = (field: FieldName) => (errors[field] ? t.errors[errors[field]!] : undefined);
  const inputClass = (field: FieldName) =>
    `block w-full rounded-xl border bg-bg/70 px-4 py-3 text-fg placeholder:text-subtle/80 transition-colors focus:border-accent/70 focus:outline-none focus:ring-2 focus:ring-accent/20 ${
      errors[field] ? "border-red-400/60" : "border-line hover:border-line-strong"
    }`;

  return (
    <form
      ref={formRef}
      action="/api/contact"
      method="post"
      noValidate
      onSubmit={onSubmit}
      className="card p-5 sm:p-8"
      aria-describedby={apiError ? id("status") : undefined}
    >
      <input type="hidden" name="locale" value={locale} readOnly />
      <input type="hidden" name="startedAt" value={startedAt || ""} readOnly />
      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
        <label htmlFor={id("website")}>{t.honeypot}</label>
        <input id={id("website")} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("name")} label={t.name} error={errorText("name")} required>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            placeholder={t.placeholders.name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id("name")}-error` : undefined}
            className={inputClass("name")}
          />
        </Field>
        <Field id={id("company")} label={t.company} optional={t.optional} error={errorText("company")}>
          <input
            id={id("company")}
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={160}
            placeholder={t.placeholders.company}
            aria-invalid={!!errors.company}
            className={inputClass("company")}
          />
        </Field>
        <Field id={id("email")} label={t.email} error={errorText("email")} required>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={200}
            placeholder={t.placeholders.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id("email")}-error` : undefined}
            className={inputClass("email")}
          />
        </Field>
        <Field id={id("contact")} label={t.contact} optional={t.optional} error={errorText("contact")}>
          <input
            id={id("contact")}
            name="contact"
            type="text"
            autoComplete="tel"
            maxLength={120}
            placeholder={t.placeholders.contact}
            aria-invalid={!!errors.contact}
            className={inputClass("contact")}
          />
        </Field>
      </div>

      <ChoiceGroup
        name="projectType"
        legend={t.projectType}
        options={projectTypes.map((v) => ({ value: v, label: t.projectTypes[v] }))}
        defaultValue={defaultProjectType}
        error={errorText("projectType")}
        idPrefix={idPrefix}
      />
      <ChoiceGroup
        name="stage"
        legend={t.stage}
        options={projectStages.map((v) => ({ value: v, label: t.stages[v] }))}
        error={errorText("stage")}
        idPrefix={idPrefix}
      />
      <ChoiceGroup
        name="budget"
        legend={t.budget}
        options={budgets.map((v) => ({ value: v, label: t.budgets[v] }))}
        error={errorText("budget")}
        idPrefix={idPrefix}
      />

      <div className="mt-7">
        <Field id={id("description")} label={t.description} error={errorText("description")} required>
          <textarea
            id={id("description")}
            name="description"
            rows={5}
            required
            maxLength={5000}
            placeholder={t.placeholders.description}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? `${id("description")}-error` : undefined}
            className={`${inputClass("description")} min-h-32 resize-y leading-relaxed`}
          />
        </Field>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-subtle">{t.privacy}</p>
        <button type="submit" disabled={status === "submitting"} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
          {status === "submitting" ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-bg/30 border-t-bg" aria-hidden="true" />
              {t.sending}
            </>
          ) : (
            <>
              {t.submit}
              <Arrow />
            </>
          )}
        </button>
      </div>

      <div id={id("status")} role="alert" aria-live="assertive" className={apiError ? "mt-5" : "sr-only"}>
        {apiError && (
          <p className="rounded-xl border border-red-400/30 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200">{t.errors[apiError]}</p>
        )}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  optional,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-2 text-sm font-medium text-fg">
        <span>
          {label}
          {required && (
            <span className="ml-0.5 text-accent" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {optional && <span className="text-xs font-normal text-subtle">{optional}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

function ChoiceGroup({
  name,
  legend,
  options,
  defaultValue,
  error,
  idPrefix,
}: {
  name: FieldName;
  legend: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  error?: string;
  idPrefix: string;
}) {
  const errorId = `${idPrefix}-${name}-error`;
  return (
    <fieldset className="mt-7" aria-describedby={error ? errorId : undefined}>
      <legend className="mb-3 text-sm font-medium text-fg">
        {legend}
        <span className="ml-0.5 text-accent" aria-hidden="true">
          *
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`relative cursor-pointer select-none rounded-full border px-3.5 py-2 text-sm transition-colors has-[:checked]:border-accent/70 has-[:checked]:bg-accent/10 has-[:checked]:text-fg has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
              error ? "border-red-400/50 text-muted" : "border-line text-muted hover:border-line-strong hover:text-fg"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={defaultValue === option.value}
              required
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </fieldset>
  );
}
