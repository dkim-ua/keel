import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/en/contact/thank-you", "/uk/contact/thank-you", "/en/contact/error", "/uk/contact/error"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
