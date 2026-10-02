/**
 * Contact form option values. Values are stable, language-independent keys
 * (stored in CRM / sent to webhooks); labels live in the dictionaries.
 */

export const projectTypes = ["web", "mobile", "saas", "custom", "ai", "automation", "mvp", "other"] as const;
export type ProjectType = (typeof projectTypes)[number];

export const projectStages = ["idea", "planning", "mvp", "product", "rebuild"] as const;
export type ProjectStage = (typeof projectStages)[number];

export const budgets = ["lt1k", "1k-3k", "3k-5k", "5k-10k", "10k-25k", "25k+", "unsure"] as const;
export type Budget = (typeof budgets)[number];

/** English labels used in notifications sent to the team (Telegram, email, webhook). */
export const optionLabelsEn = {
  projectType: {
    web: "Web Development",
    mobile: "Mobile App",
    saas: "SaaS",
    custom: "Custom Software",
    ai: "AI Solution",
    automation: "Automation",
    mvp: "MVP",
    other: "Other",
  } satisfies Record<ProjectType, string>,
  stage: {
    idea: "Idea",
    planning: "Planning",
    mvp: "Existing MVP",
    product: "Existing Product",
    rebuild: "Need to rebuild",
  } satisfies Record<ProjectStage, string>,
  budget: {
    lt1k: "Under $1,000",
    "1k-3k": "$1,000–3,000",
    "3k-5k": "$3,000–5,000",
    "5k-10k": "$5,000–10,000",
    "10k-25k": "$10,000–25,000",
    "25k+": "$25,000+",
    unsure: "Not sure",
  } satisfies Record<Budget, string>,
};
