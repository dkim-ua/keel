import { isLocale, type Locale } from "../i18n";
import { findCountry, formatPhone } from "./countries";
import { budgets, projectStages, projectTypes, type Budget, type ProjectStage, type ProjectType } from "./options";

export type Lead = {
  name: string;
  company: string;
  email: string;
  phone: string;
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
  phone: 32,
  description: 5000,
  sourcePage: 300,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** "+<country code> <national number>", digits with optional spaces, dashes, dots and parentheses. */
const PHONE_RE = /^\+\d{1,4} [\d\s().-]{3,24}$/;

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
  // Phone arrives either as a ready string (JSON clients) or as country + number (HTML form).
  const country = findCountry(str(input.phoneCountry));
  const phone = country ? formatPhone(country.dial, str(input.phoneNumber)) : str(input.phone);
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

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (phone.length > LIMITS.phone) errors.phone = "tooLong";
    else if (!PHONE_RE.test(phone) || digits.length < 7 || digits.length > 15) errors.phone = "invalid";
  }

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
      phone,
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
