import { recordToCase, staticCaseRecords, type CaseRecord, type CaseStudy } from "@/content/cases";
import type { Locale } from "../i18n";
import { parseJson, pipeline, redis, storageEnabled } from "./redis";

/**
 * Case studies storage.
 * Cases live in Redis (edited in /admin/cases). While the database is empty
 * or not connected, the site shows the built-in concept cases.
 */

const INDEX = "cases";
const key = (id: string) => `case:${id}`;

type Mode = "live" | "cached";

export async function listCaseRecords(mode: Mode = "live"): Promise<CaseRecord[]> {
  const ids = await redis<string[]>(["ZRANGE", INDEX, 0, -1], mode);
  if (!ids?.length) return [];
  const values = await redis<(string | null)[]>(["MGET", ...ids.map(key)], mode);
  return values
    .map((v) => parseJson<CaseRecord>(v))
    .filter((c): c is CaseRecord => !!c)
    .sort((a, b) => a.order - b.order);
}

export async function getCaseRecord(id: string): Promise<CaseRecord | null> {
  return parseJson<CaseRecord>(await redis(["GET", key(id)]));
}

export async function saveCaseRecord(record: CaseRecord) {
  const stored: CaseRecord = { ...record, updatedAt: new Date().toISOString() };
  await pipeline([
    ["SET", key(record.id), JSON.stringify(stored)],
    ["ZADD", INDEX, record.order, record.id],
  ]);
}

export async function deleteCaseRecord(id: string) {
  await pipeline([
    ["DEL", key(id)],
    ["ZREM", INDEX, id],
  ]);
}

/** Copies the built-in concept cases into the database so they can be edited or removed. */
export async function seedStaticCases() {
  const existing = await listCaseRecords();
  const slugs = new Set(existing.map((r) => r.slug));
  const start = existing.reduce((max, r) => Math.max(max, r.order), -1) + 1;
  const records = staticCaseRecords()
    .filter((r) => !slugs.has(r.slug))
    .map((r, i) => ({ ...r, order: start + i }));
  await pipeline(records.flatMap((r) => [["SET", key(r.id), JSON.stringify(r)], ["ZADD", INDEX, r.order, r.id]]));
}

/* ───────────────────────────── Public reads ───────────────────────────── */

async function publicRecords(): Promise<CaseRecord[]> {
  if (!storageEnabled()) return staticCaseRecords();
  try {
    const records = await listCaseRecords("cached");
    return records.length ? records.filter((r) => r.published) : staticCaseRecords();
  } catch (error) {
    console.error("[cases] falling back to built-in cases:", error instanceof Error ? error.message : error);
    return staticCaseRecords();
  }
}

export async function getCases(locale: Locale): Promise<CaseStudy[]> {
  return (await publicRecords()).map((r) => recordToCase(r, locale));
}

export async function getCase(locale: Locale, slug: string): Promise<CaseStudy | undefined> {
  const record = (await publicRecords()).find((r) => r.slug === slug);
  return record ? recordToCase(record, locale) : undefined;
}

export async function getCaseSlugs(): Promise<string[]> {
  return (await publicRecords()).map((r) => r.slug);
}
