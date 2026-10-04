import type { Lead } from "../contact/validate";
import { parseJson, pipeline, redis } from "./redis";

import type { LeadStatus } from "./lead-status";

export { leadStatuses, type LeadStatus } from "./lead-status";

export type StoredLead = Lead & {
  id: string;
  submittedAt: string;
  status: LeadStatus;
  country?: string;
  note?: string;
};

const INDEX = "leads";
const key = (id: string) => `lead:${id}`;

export async function saveLead(lead: Lead, meta: { id: string; submittedAt: string; country?: string }) {
  const record: StoredLead = { ...lead, id: meta.id, submittedAt: meta.submittedAt, status: "new", country: meta.country };
  await pipeline([
    ["SET", key(meta.id), JSON.stringify(record)],
    ["ZADD", INDEX, Date.parse(meta.submittedAt), meta.id],
  ]);
}

export async function listLeads(options: { status?: LeadStatus | "all"; limit?: number } = {}): Promise<StoredLead[]> {
  const ids = await redis<string[]>(["ZRANGE", INDEX, 0, (options.limit ?? 500) - 1, "REV"]);
  if (!ids?.length) return [];
  const values = await redis<(string | null)[]>(["MGET", ...ids.map(key)]);
  const leads = values.map((v) => parseJson<StoredLead>(v)).filter((l): l is StoredLead => !!l);
  return options.status && options.status !== "all" ? leads.filter((l) => l.status === options.status) : leads;
}

export async function updateLead(id: string, patch: Partial<Pick<StoredLead, "status" | "note">>) {
  const current = parseJson<StoredLead>(await redis(["GET", key(id)]));
  if (!current) return;
  await redis(["SET", key(id), JSON.stringify({ ...current, ...patch })]);
}

export async function deleteLead(id: string) {
  await pipeline([
    ["DEL", key(id)],
    ["ZREM", INDEX, id],
  ]);
}

/** Number of leads per day (YYYY-MM-DD, UTC) in the range. */
export async function countLeadsSince(sinceMs: number): Promise<number> {
  return Number(await redis(["ZCOUNT", INDEX, sinceMs, "+inf"])) || 0;
}

export async function leadTimestampsSince(sinceMs: number): Promise<number[]> {
  const raw = await redis<string[]>(["ZRANGE", INDEX, sinceMs, "+inf", "BYSCORE", "WITHSCORES"]);
  const out: number[] = [];
  for (let i = 1; i < (raw?.length ?? 0); i += 2) out.push(Number(raw[i]));
  return out;
}
