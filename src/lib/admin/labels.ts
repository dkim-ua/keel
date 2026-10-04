import type { Budget, ProjectStage, ProjectType } from "../contact/options";
import type { CaseKind } from "@/content/cases";
import type { LeadStatus } from "../db/lead-status";

const TIME_ZONE = "Europe/Kyiv";

export const projectTypeLabels: Record<ProjectType, string> = {
  web: "Веб-разработка",
  mobile: "Мобильное приложение",
  saas: "SaaS",
  custom: "Кастомное ПО",
  ai: "AI-решение",
  automation: "Автоматизация",
  mvp: "MVP",
  other: "Другое",
};

export const stageLabels: Record<ProjectStage, string> = {
  idea: "Идея",
  planning: "Планирование",
  mvp: "Есть MVP",
  product: "Есть продукт",
  rebuild: "Нужно переделать",
};

export const budgetLabels: Record<Budget, string> = {
  lt1k: "до $1 000",
  "1k-3k": "$1 000–3 000",
  "3k-5k": "$3 000–5 000",
  "5k-10k": "$5 000–10 000",
  "10k-25k": "$10 000–25 000",
  "25k+": "$25 000+",
  unsure: "Не знает",
};

export const statusLabels: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Закрыта",
  spam: "Спам",
};

export const statusStyles: Record<LeadStatus, string> = {
  new: "border-accent/50 bg-accent/10 text-accent-strong",
  in_progress: "border-amber-300/40 bg-amber-300/10 text-amber-200",
  done: "border-signal/40 bg-signal/10 text-signal",
  spam: "border-line-strong bg-white/[0.03] text-subtle",
};

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function countryLabel(iso: string): string {
  try {
    return new Intl.DisplayNames(["ru"], { type: "region" }).of(iso) ?? iso;
  } catch {
    return iso;
  }
}

export const kindLabels: Record<CaseKind, string> = {
  concept: "Концепт / внутренний",
  product: "Свой продукт",
  client: "Клиентский проект",
};
