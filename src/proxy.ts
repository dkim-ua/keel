import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

/**
 * Locale routing (Next.js 16 "proxy", formerly middleware).
 * Every page lives under /en or /uk — each language has its own crawlable URLs.
 * Requests without a locale prefix are redirected to the preferred language.
 */

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  const languages = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of languages) {
    const base = tag.split("-")[0];
    if (base === "uk") return "uk";
    if (base === "en") return "en";
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (isLocale(first)) {
    const response = NextResponse.next();
    // Remember the explicit choice made via the language switcher / URL.
    if (request.cookies.get("NEXT_LOCALE")?.value !== first) {
      response.cookies.set("NEXT_LOCALE", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip API routes, Next internals and files with an extension (icon.svg, robots.txt, sitemap.xml, images).
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
