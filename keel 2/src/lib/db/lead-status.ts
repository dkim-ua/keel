/** Lead statuses — shared by server code and admin client components. */
export const leadStatuses = ["new", "in_progress", "done", "spam"] as const;
export type LeadStatus = (typeof leadStatuses)[number];
