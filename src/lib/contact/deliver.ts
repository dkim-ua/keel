// Server-only module: imported exclusively by app/api/contact/route.ts.
import { createHmac } from "node:crypto";
import type { Lead } from "./validate";
import { optionLabelsEn } from "./options";

/**
 * Lead delivery channels. Each channel is enabled by environment variables.
 * Every configured channel receives every lead; the submission succeeds if at
 * least one channel accepted it. Adding a CRM = add another `Channel` below.
 */

type Channel = {
  name: string;
  enabled: () => boolean;
  send: (lead: Lead, meta: LeadMeta) => Promise<void>;
};

export type LeadMeta = { id: string; submittedAt: string };

const env = (key: string) => process.env[key]?.trim() || undefined;

/** Request timeout without relying on AbortSignal.timeout (works on every runtime and TS lib). */
function timeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

function readable(lead: Lead) {
  return {
    projectType: optionLabelsEn.projectType[lead.projectType],
    stage: optionLabelsEn.stage[lead.stage],
    budget: optionLabelsEn.budget[lead.budget],
  };
}

function plainText(lead: Lead, meta: LeadMeta): string {
  const r = readable(lead);
  return [
    `New project request — ${meta.id}`,
    "",
    `Name: ${lead.name}`,
    `Company: ${lead.company || "—"}`,
    `Email: ${lead.email}`,
    `Telegram / Phone: ${lead.contact || "—"}`,
    `Need: ${r.projectType}`,
    `Stage: ${r.stage}`,
    `Budget: ${r.budget}`,
    "",
    "Project description:",
    lead.description,
    "",
    `Language: ${lead.locale.toUpperCase()} · Page: ${lead.sourcePage || "—"}`,
    `Submitted: ${meta.submittedAt}`,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function assertOk(res: Response, channel: string) {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${channel} responded ${res.status}: ${body.slice(0, 300)}`);
  }
}

function telegramChatIds(): string[] {
  return (env("TELEGRAM_CHAT_ID") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

const telegram: Channel = {
  name: "telegram",
  enabled: () => !!env("TELEGRAM_BOT_TOKEN") && telegramChatIds().length > 0,
  async send(lead, meta) {
    const r = readable(lead);
    const e = escapeHtml;
    const description = lead.description.length > 3000 ? `${lead.description.slice(0, 3000)}…` : lead.description;
    const text = [
      `<b>New project request</b> · <code>${meta.id}</code>`,
      "",
      `<b>Name:</b> ${e(lead.name)}`,
      `<b>Company:</b> ${e(lead.company || "—")}`,
      `<b>Email:</b> ${e(lead.email)}`,
      `<b>Telegram / Phone:</b> ${e(lead.contact || "—")}`,
      `<b>Need:</b> ${r.projectType}`,
      `<b>Stage:</b> ${r.stage}`,
      `<b>Budget:</b> ${r.budget}`,
      "",
      `<b>Description:</b>`,
      e(description),
      "",
      `<i>${lead.locale.toUpperCase()} · ${e(lead.sourcePage || "—")}</i>`,
    ].join("\n");

    // TELEGRAM_CHAT_ID may hold several recipients separated by commas:
    // every person (or group) receives every lead.
    const chatIds = telegramChatIds();
    const results = await Promise.allSettled(
      chatIds.map(async (chatId) => {
        const res = await fetch(`https://api.telegram.org/bot${env("TELEGRAM_BOT_TOKEN")}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
          signal: timeoutSignal(10_000),
        });
        await assertOk(res, `Telegram (chat ${chatId})`);
      }),
    );
    const failed = results.flatMap((r) => (r.status === "rejected" ? [String(r.reason instanceof Error ? r.reason.message : r.reason)] : []));
    if (failed.length === chatIds.length) throw new Error(failed.join("; "));
    if (failed.length) console.error("[contact] some Telegram recipients failed", { id: meta.id, failed });
  },
};

const email: Channel = {
  name: "email",
  enabled: () => !!(env("RESEND_API_KEY") && env("CONTACT_EMAIL_TO") && env("CONTACT_EMAIL_FROM")),
  async send(lead, meta) {
    const r = readable(lead);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env("CONTACT_EMAIL_FROM"),
        to: env("CONTACT_EMAIL_TO")!.split(",").map((address: string) => address.trim()).filter(Boolean),
        reply_to: lead.email,
        subject: `New project request: ${r.projectType} — ${lead.company || lead.name}`,
        text: plainText(lead, meta),
      }),
      signal: timeoutSignal(10_000),
    });
    await assertOk(res, "Resend");
  },
};

const webhook: Channel = {
  name: "webhook",
  enabled: () => !!env("CONTACT_WEBHOOK_URL"),
  async send(lead, meta) {
    const body = JSON.stringify({
      event: "lead.created",
      id: meta.id,
      submittedAt: meta.submittedAt,
      lead,
      labels: readable(lead),
    });
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const secret = env("CONTACT_WEBHOOK_SECRET");
    if (secret) headers["X-Keel-Signature"] = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

    const res = await fetch(env("CONTACT_WEBHOOK_URL")!, {
      method: "POST",
      headers,
      body,
      signal: timeoutSignal(10_000),
    });
    await assertOk(res, "Webhook");
  },
};

const channels: Channel[] = [telegram, email, webhook];

export type DeliveryResult =
  | { status: "delivered"; channels: string[] }
  | { status: "failed"; errors: string[] }
  | { status: "not-configured" };

export async function deliverLead(lead: Lead, meta: LeadMeta): Promise<DeliveryResult> {
  const active = channels.filter((c) => c.enabled());
  if (active.length === 0) return { status: "not-configured" };

  const results = await Promise.allSettled(active.map((c) => c.send(lead, meta)));
  const delivered: string[] = [];
  const errors: string[] = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") delivered.push(active[i].name);
    else errors.push(`${active[i].name}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`);
  });

  if (errors.length) console.error("[contact] delivery errors", { id: meta.id, errors });
  return delivered.length ? { status: "delivered", channels: delivered } : { status: "failed", errors };
}

export { plainText as formatLeadText };
