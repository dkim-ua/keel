import { createHash } from "node:crypto";
import { pipeline } from "./redis";

/**
 * Cookieless, privacy-friendly page view analytics.
 * No cookies and no personal data: a visitor is counted as a daily hash of
 * (day + secret + IP + user agent), so visitors can't be tracked across days.
 * Daily keys expire after ~13 months.
 */

export const ANALYTICS_TIME_ZONE = "Europe/Kyiv";
const TTL_SECONDS = 400 * 24 * 60 * 60;
const dims = ["pages", "ref", "country", "device", "lang"] as const;
type Dim = (typeof dims)[number];

/** YYYY-MM-DD in the analytics time zone. */
export function dayKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ANALYTICS_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function lastDays(count: number, until = new Date()): string[] {
  const days: string[] = [];
  for (let i = count - 1; i >= 0; i--) days.push(dayKey(new Date(until.getTime() - i * 86_400_000)));
  return [...new Set(days)];
}

const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|monitor|curl|wget|python|axios|node-fetch/i;

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT_RE.test(userAgent);
}

function deviceOf(userAgent: string): string {
  if (/ipad|tablet/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

function referrerHost(referrer: string, siteHost: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host && host !== siteHost.replace(/^www\./, "") ? host : null;
  } catch {
    return null;
  }
}

export type PageviewInput = {
  path: string;
  referrer: string;
  userAgent: string;
  ip: string;
  country?: string;
  siteHost: string;
};

export async function recordPageview(input: PageviewInput) {
  const day = dayKey();
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "keel";
  const visitor = createHash("sha256").update(`${day}|${secret}|${input.ip}|${input.userAgent}`).digest("hex").slice(0, 20);
  const path = input.path.split("?")[0].slice(0, 200) || "/";
  const lang = path.split("/")[1] || "—";
  const ref = referrerHost(input.referrer, input.siteHost);

  const k = (name: string) => `stats:${name}:${day}`;
  const commands: (string | number)[][] = [
    ["INCR", k("pv")],
    ["PFADD", k("uv"), visitor],
    ["ZINCRBY", k("pages"), 1, path],
    ["ZINCRBY", k("device"), 1, deviceOf(input.userAgent)],
    ["ZINCRBY", k("lang"), 1, lang],
  ];
  if (ref) commands.push(["ZINCRBY", k("ref"), 1, ref]);
  if (input.country) commands.push(["ZINCRBY", k("country"), 1, input.country.toUpperCase()]);
  for (const name of ["pv", "uv", ...dims]) commands.push(["EXPIRE", k(name), TTL_SECONDS]);
  await pipeline(commands);
}

export type Stats = {
  days: { day: string; views: number; visitors: number; leads: number }[];
  totals: { views: number; visitors: number; leads: number };
  top: Record<Dim, { name: string; count: number }[]>;
};

export async function getStats(dayCount: number, leadTimestamps: number[] = []): Promise<Stats> {
  const days = lastDays(dayCount);
  const commands: (string | number)[][] = [];
  for (const d of days) commands.push(["GET", `stats:pv:${d}`], ["PFCOUNT", `stats:uv:${d}`]);
  commands.push(["PFCOUNT", ...days.map((d) => `stats:uv:${d}`)]);
  for (const dim of dims) for (const d of days) commands.push(["ZRANGE", `stats:${dim}:${d}`, 0, -1, "WITHSCORES"]);

  const results = await pipeline<unknown[]>(commands);

  const leadsPerDay = new Map<string, number>();
  for (const ts of leadTimestamps) {
    const d = dayKey(new Date(ts));
    leadsPerDay.set(d, (leadsPerDay.get(d) ?? 0) + 1);
  }

  let i = 0;
  const series = days.map((day) => {
    const views = Number(results[i++] ?? 0) || 0;
    const visitors = Number(results[i++] ?? 0) || 0;
    return { day, views, visitors, leads: leadsPerDay.get(day) ?? 0 };
  });
  const uniqueVisitors = Number(results[i++] ?? 0) || 0;

  const top = {} as Stats["top"];
  for (const dim of dims) {
    const acc = new Map<string, number>();
    for (let n = 0; n < days.length; n++) {
      const flat = (results[i++] as string[] | null) ?? [];
      for (let j = 0; j + 1 < flat.length; j += 2) acc.set(flat[j], (acc.get(flat[j]) ?? 0) + Number(flat[j + 1]));
    }
    top[dim] = [...acc.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  return {
    days: series,
    totals: {
      views: series.reduce((s, d) => s + d.views, 0),
      visitors: uniqueVisitors,
      leads: series.reduce((s, d) => s + d.leads, 0),
    },
    top,
  };
}
