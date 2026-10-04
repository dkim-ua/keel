/**
 * Minimal Upstash Redis REST client (no dependencies).
 *
 * Connect a database in Vercel: Storage → Create → Upstash for Redis.
 * Vercel then adds KV_REST_API_URL / KV_REST_API_TOKEN automatically.
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are accepted as well.
 */

type Arg = string | number;

function config() {
  const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").trim().replace(/\/$/, "");
  const token = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
  return url && token ? { url, token } : null;
}

export function storageEnabled(): boolean {
  return config() !== null;
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("Storage is not configured (KV_REST_API_URL / KV_REST_API_TOKEN).");
  }
}

type FetchMode = "live" | "cached";

async function post(path: string, body: unknown, mode: FetchMode) {
  const cfg = config();
  if (!cfg) throw new StorageNotConfiguredError();
  const res = await fetch(`${cfg.url}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // "live": always fresh (admin, API routes). "cached": lets public pages be statically rendered
    // and refreshed by ISR / revalidatePath after edits in the admin panel.
    ...(mode === "live" ? { cache: "no-store" as const } : {}),
  });
  const data = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error ?? `HTTP ${res.status}`;
    throw new Error(`Redis error: ${message}`);
  }
  return data;
}

/** Runs one command, e.g. redis(["GET", "key"]). */
export async function redis<T = unknown>(command: Arg[], mode: FetchMode = "live"): Promise<T> {
  const data = (await post("", command, mode)) as { result?: T; error?: string };
  if (data?.error) throw new Error(`Redis error: ${data.error}`);
  return data.result as T;
}

/** Runs several commands in one request; results are returned in order. */
export async function pipeline<T extends unknown[] = unknown[]>(commands: Arg[][], mode: FetchMode = "live"): Promise<T> {
  if (commands.length === 0) return [] as unknown as T;
  const data = (await post("/pipeline", commands, mode)) as { result?: unknown; error?: string }[];
  return data.map((item) => {
    if (item?.error) throw new Error(`Redis error: ${item.error}`);
    return item.result;
  }) as T;
}

export function parseJson<T>(value: unknown): T | null {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
