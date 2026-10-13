/** Team roles shown in the "A team built around your project" section. */
export const roleIds = ["pm", "design", "frontend", "backend", "mobile", "qa", "devops"] as const;
export type RoleId = (typeof roleIds)[number];
