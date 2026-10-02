# Keel — website

B2B website for **Keel**, a software development agency.
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · EN / UK.

> **Your project. Our responsibility.**

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in the values you have
npm run dev                  # http://localhost:3000 → redirects to /en or /uk
```

Production:

```bash
npm run build && npm start
```

Requires Node.js 20.9+. Deploys as-is to Vercel or any Node host (the contact API needs a server runtime, so not a static export).

---

## Structure

```
src/
  app/
    [locale]/                    # /en and /uk — every page has its own URL per language
      layout.tsx                 # <html lang>, fonts, Navbar, Footer
      page.tsx                   # Home
      about/page.tsx
      contact/page.tsx           # Standalone form page
      contact/thank-you|error/   # Result pages for no-JS form posts (noindex)
      services/[slug]/page.tsx   # 6 SEO service pages
      work/page.tsx              # Case list
      work/[slug]/page.tsx       # Case pages
      opengraph-image.tsx, twitter-image.tsx
      not-found.tsx, [...rest]/  # Localized 404
    api/contact/route.ts         # Lead endpoint (JSON + classic form posts)
    sitemap.ts, robots.ts, icon.svg, globals.css
  proxy.ts                       # Locale redirect (/ → /en or /uk by cookie / Accept-Language)
  components/
    Navbar, Hero, Value, Services, Process, TeamModel, WhyUs,
    Cases, Technology, FAQ, CTA, ContactForm, Footer, PageHeader, ...
  content/
    dictionaries/en.ts, uk.ts    # All UI copy (uk is type-checked against en)
    services/en.ts, uk.ts        # Service page content
    cases.ts                     # Case studies
  lib/
    i18n.ts, seo.ts, site.ts
    contact/                     # validation, delivery channels, rate limit
```

---

## Contact form

The form is real: it sends data to `POST /api/contact`, and the success message ("Thank you. We'll get back to you shortly.") is shown **only** after the server confirms delivery.

- **With JavaScript:** JSON request, inline validation and errors.
- **Without JavaScript:** a regular form post; the server redirects to `/{locale}/contact/thank-you` or `/{locale}/contact/error`.
- **Server-side:** validation, honeypot field, minimum fill time, rate limit (5 requests / 10 min per IP).

### Delivery channels (`.env.local`)

Configure one or more — every configured channel receives every lead.

| Channel  | Variables                                                     |
|----------|---------------------------------------------------------------|
| Telegram | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (one or more numeric ids, comma-separated) |
| Email    | `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`     |
| CRM / any webhook | `CONTACT_WEBHOOK_URL`, optional `CONTACT_WEBHOOK_SECRET` |

- **Development** with no channel configured: the lead is printed to the server console and the form succeeds, so you can test the flow.
- **Production** with no channel configured: the API returns `503` and the user sees an error — leads are never silently lost.

Webhook payload:

```json
{
  "event": "lead.created",
  "id": "KL-1A2B3C4D",
  "submittedAt": "2026-10-02T12:00:00.000Z",
  "lead": { "name": "...", "company": "...", "email": "...", "contact": "...",
            "projectType": "web", "stage": "idea", "budget": "5k-10k",
            "description": "...", "locale": "en", "sourcePage": "/en" },
  "labels": { "projectType": "Web Development", "stage": "Idea", "budget": "$5,000–10,000" }
}
```

With `CONTACT_WEBHOOK_SECRET` set, the header `X-Keel-Signature: sha256=<hex>` contains an HMAC-SHA256 of the raw body. Use it with Make, Zapier, n8n, HubSpot/Pipedrive automations or your own backend.

To add another channel (e.g. a native CRM API), add a `Channel` object in `src/lib/contact/deliver.ts`.

---

## Company data — nothing is invented

The site contains no fictional clients, testimonials, team size, years, offices or metrics.

- **Email and social links** appear only when set: `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_GITHUB_URL`. Until then the footer shows no contact placeholders.
- **Case studies** are three concept projects, explicitly labelled **"Concept / Internal Project"**, with a "Concept focus" instead of results.

### Adding a real client case

In `src/content/cases.ts`, add an entry to both `casesEn` and `casesUk`:

```ts
{
  slug: "client-project",
  kind: "client",          // shows "Client project" badge and "Result"
  preview: "board",        // "board" | "chart" | "chat"
  name: "...",
  type: "...",
  summary: "...",
  stack: ["..."],
  outcome: "Verified result, approved by the client",
  challenge: "...",
  solution: "...",
  architecture: [{ name: "...", text: "..." }],
  scope: ["..."],
}
```

The page `/en/work/client-project`, the sitemap entry and the card on the home page are created automatically. Remove the concept entries when they are no longer needed.

---

## Content & languages

- UI copy: `src/content/dictionaries/{en,uk}.ts`
- Services: `src/content/services/{en,uk}.ts` (slugs, icons and the pre-selected form option live in `services/types.ts`)
- To add a language: add it to `locales` in `src/lib/i18n.ts`, create the dictionary and service files, and register them in the two `index.ts` files.

## SEO

- Separate crawlable URLs per language (`/en/...`, `/uk/...`) with `hreflang` alternates and `x-default`
- Per-page title, description, canonical, Open Graph and Twitter cards
- Generated OG image, `sitemap.xml` (with language alternates), `robots.txt`, SVG favicon
- Schema.org: Organization, WebSite, Service, FAQPage, BreadcrumbList
- Set `NEXT_PUBLIC_SITE_URL` in production — canonical URLs and the sitemap depend on it.

## Performance & accessibility

- Server components by default; client JS only for the navbar, language switcher, team composer, form and scroll-reveal observer
- Hero diagram is inline SVG with CSS animation — no images, canvas or 3D
- Content is visible without JavaScript; `prefers-reduced-motion` disables animation
- FAQ uses native `<details>`; skip link, focus styles, labelled form controls, ARIA live regions for form status

---

## Deploy (Vercel)

1. Push the project to a GitHub repository.
2. On vercel.com: **Add New → Project → Import** the repository. Framework is detected automatically (Next.js).
3. In **Environment Variables** add `NEXT_PUBLIC_SITE_URL` and at least one lead channel (e.g. `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
4. **Deploy.** Every push to `main` redeploys automatically.

Note: Vercel's free Hobby plan is for non-commercial use; a company website needs the Pro plan.
# keel
