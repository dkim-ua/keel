/**
 * Central site configuration.
 * Everything that is company-specific and may not exist yet (email, socials)
 * comes from environment variables and is rendered only when present —
 * the site never shows placeholder contact data.
 */

function clean(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

export const siteConfig = {
  name: "Keel",
  tagline: "Your project. Our responsibility.",
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, ""),
  email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  social: {
    linkedin: clean(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    github: clean(process.env.NEXT_PUBLIC_GITHUB_URL),
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function socialLinks(): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  if (siteConfig.social.linkedin) links.push({ label: "LinkedIn", href: siteConfig.social.linkedin });
  if (siteConfig.social.github) links.push({ label: "GitHub", href: siteConfig.social.github });
  return links;
}
