import { NextResponse, type NextRequest } from "next/server";
import { isBot, recordPageview } from "@/lib/db/analytics";
import { storageEnabled } from "@/lib/db/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Receives page views from <PageviewTracker />. Always answers 204 so tracking never affects the site. */
export async function POST(request: NextRequest) {
  try {
    if (!storageEnabled()) return new NextResponse(null, { status: 204 });

    const userAgent = request.headers.get("user-agent") ?? "";
    if (isBot(userAgent)) return new NextResponse(null, { status: 204 });

    const body = (await request.json().catch(() => null)) as { path?: unknown; referrer?: unknown } | null;
    const path = typeof body?.path === "string" ? body.path : "";
    if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
      return new NextResponse(null, { status: 204 });
    }

    await recordPageview({
      path,
      referrer: typeof body?.referrer === "string" ? body.referrer : "",
      userAgent,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "",
      country: request.headers.get("x-vercel-ip-country") ?? undefined,
      siteHost: request.nextUrl.hostname,
    });
  } catch (error) {
    console.error("[track]", error instanceof Error ? error.message : error);
  }
  return new NextResponse(null, { status: 204 });
}
