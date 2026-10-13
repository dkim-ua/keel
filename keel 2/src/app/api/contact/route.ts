import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { deliverLead, formatLeadText } from "@/lib/contact/deliver";
import { rateLimit } from "@/lib/contact/rate-limit";
import { validateLead } from "@/lib/contact/validate";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Minimum time (ms) between rendering the form and submitting it. Bots are faster. */
const MIN_FILL_TIME_MS = 2500;

type ApiError = "validation" | "rate_limited" | "delivery_failed" | "not_configured" | "bad_request";

/**
 * POST /api/contact
 * Accepts JSON (fetch from ContactForm) or regular form posts (works without JavaScript).
 * JSON clients receive JSON; HTML form posts receive a 303 redirect to a result page.
 */
export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  let input: Record<string, unknown>;
  try {
    input = isJson ? await request.json() : Object.fromEntries((await request.formData()).entries());
  } catch {
    return respond({ isJson, locale: "en", ok: false, error: "bad_request", status: 400, request });
  }

  const locale: Locale = isLocale(String(input.locale ?? "")) ? (input.locale as Locale) : "en";

  // Spam protection: honeypot + minimum fill time. Bots get a silent "success".
  const honeypot = typeof input.website === "string" && input.website.trim() !== "";
  const startedAt = Number(input.startedAt);
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS;
  if (honeypot || tooFast) {
    return respond({ isJson, locale, ok: true, status: 200, request });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(`contact:${ip}`)) {
    return respond({ isJson, locale, ok: false, error: "rate_limited", status: 429, request });
  }

  const result = validateLead(input);
  if (!result.ok) {
    return respond({ isJson, locale, ok: false, error: "validation", status: 422, request, fields: result.errors });
  }

  const meta = {
    id: `KL-${randomUUID().slice(0, 8).toUpperCase()}`,
    submittedAt: new Date().toISOString(),
    country: request.headers.get("x-vercel-ip-country") ?? undefined,
  };
  const delivery = await deliverLead(result.lead, meta);

  if (delivery.status === "not-configured") {
    if (process.env.NODE_ENV !== "production") {
      // Local development: no channel configured — print the lead so the flow can be tested end to end.
      console.info(`[contact] No delivery channel configured. Lead received in development:\n${formatLeadText(result.lead, meta)}`);
      return respond({ isJson, locale, ok: true, status: 200, request, id: meta.id });
    }
    console.error("[contact] No delivery channel configured — lead was NOT delivered.", meta.id);
    return respond({ isJson, locale, ok: false, error: "not_configured", status: 503, request });
  }

  if (delivery.status === "failed") {
    return respond({ isJson, locale, ok: false, error: "delivery_failed", status: 502, request });
  }

  return respond({ isJson, locale, ok: true, status: 200, request, id: meta.id });
}

function respond(opts: {
  isJson: boolean;
  locale: Locale;
  ok: boolean;
  status: number;
  request: NextRequest;
  error?: ApiError;
  fields?: Record<string, string>;
  id?: string;
}) {
  if (opts.isJson) {
    return NextResponse.json(
      opts.ok ? { ok: true, id: opts.id } : { ok: false, error: opts.error, fields: opts.fields },
      { status: opts.status },
    );
  }
  const target = opts.ok ? "/contact/thank-you" : "/contact/error";
  return NextResponse.redirect(new URL(localePath(opts.locale, target), opts.request.url), 303);
}

export function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
}
