import type { ProjectType } from "@/lib/contact/options";

export const serviceSlugs = [
  "web-development",
  "mobile-development",
  "custom-software",
  "ai-development",
  "automation",
  "mvp-development",
] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}

/** Language-independent service settings. */
export const serviceSettings: Record<ServiceSlug, { formType: ProjectType; icon: ServiceIcon }> = {
  "web-development": { formType: "web", icon: "web" },
  "mobile-development": { formType: "mobile", icon: "mobile" },
  "custom-software": { formType: "custom", icon: "custom" },
  "ai-development": { formType: "ai", icon: "ai" },
  automation: { formType: "automation", icon: "automation" },
  "mvp-development": { formType: "mvp", icon: "mvp" },
};

export type ServiceIcon = "web" | "mobile" | "custom" | "ai" | "automation" | "mvp";

export type ServiceContent = {
  /** Card / navigation title, e.g. "Web Development". */
  name: string;
  /** Short description used on the home page card. */
  summary: string;
  seo: { title: string; description: string };
  hero: { title: string; description: string };
  build: { title: string; text: string }[];
  useCases: string[];
  approach: { title: string; text: string }[];
  technology: { name: string; items: string[] }[];
  faq: { question: string; answer: string }[];
  cta: { title: string; text: string; button: string };
};
