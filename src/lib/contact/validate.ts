import { isLocale, type Locale } from "../i18n";
import { budgets, projectStages, projectTypes, type Budget, type ProjectStage, type ProjectType } from "./options";

export type Lead = {
  name: string;
  company: string;
  email: string;
  contact: string;
  projectType: ProjectType;
  stage: ProjectStage;
  budget: Budget;
  description: string;
  locale: Locale;
  sourcePage: string;
};

export type FieldError = "required" | "invalid" | "tooLong";
export type ValidationResult =
  | { ok: true; lead: Lead }
  | { ok: false; errors: Partial<Record<keyof Lead, FieldError>> };

const LIMITS = {
  name: 120,
  company: 160,
  email: 200,
  contact: 120,
  description: 5000,
  sourcePage: 300,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/** Validates raw input (JSON body or form data converted to an object). */
export function validateLead(input: Record<string, unknown>): ValidationResult {
  const errors: Partial<Record<keyof Lead, FieldError>> = {};

  const name = str(input.name);
  const company = str(input.company);
  const email = str(input.email);
  const contact = str(input.contact);
  const projectType = str(input.projectType);
  const stage = str(input.stage);
  const budget = str(input.budget);
  const description = str(input.description);
  const localeRaw = str(input.locale);
  const sourcePage = str(input.sourcePage).slice(0, LIMITS.sourcePage);

  if (!name) errors.name = "required";
  else if (name.length > LIMITS.name) errors.name = "tooLong";

  if (company.length > LIMITS.company) errors.company = "tooLong";

  if (!email) errors.email = "required";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.email = "invalid";

  if (contact.length > LIMITS.contact) errors.contact = "tooLong";

  if (!projectType) errors.projectType = "required";
  else if (!oneOf(projectTypes, projectType)) errors.projectType = "invalid";

  if (!stage) errors.stage = "required";
  else if (!oneOf(projectStages, stage)) errors.stage = "invalid";

  if (!budget) errors.budget = "required";
  else if (!oneOf(budgets, budget)) errors.budget = "invalid";

  if (!description) errors.description = "required";
  else if (description.length > LIMITS.description) errors.description = "tooLong";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      name,
      company,
      email,
      contact,
      projectType: projectType as ProjectType,
      stage: stage as ProjectStage,
      budget: budget as Budget,
      description,
      locale: isLocale(localeRaw) ? localeRaw : "en",
      sourcePage,
    },
  };
}

export const contactLimits = LIMITS;
