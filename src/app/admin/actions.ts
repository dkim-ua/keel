"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { CaseRecord } from "@/content/cases";
import { parseCaseForm } from "@/lib/admin/case-form";
import { ADMIN_COOKIE, checkPassword, createSessionToken, requireAdmin, sessionCookieOptions } from "@/lib/admin/auth";
import { deleteBlobs } from "@/lib/admin/blob";
import { rateLimit } from "@/lib/contact/rate-limit";
import {
  deleteCaseRecord,
  getCaseRecord,
  listCaseRecords,
  saveCaseRecord,
  seedStaticCases,
} from "@/lib/db/cases";
import { deleteLead, leadStatuses, updateLead, type LeadStatus } from "@/lib/db/leads";

export type FormState = { error?: string } | undefined;

/** Refreshes every public page that may show cases. */
function refreshSite() {
  revalidatePath("/", "layout");
}

/* ───────────────────────────── Auth ───────────────────────────── */

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000)) {
    return { error: "Слишком много попыток. Попробуйте через 15 минут." };
  }
  const password = String(form.get("password") ?? "");
  if (!checkPassword(password)) return { error: "Неверный пароль." };

  (await cookies()).set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions);
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/* ───────────────────────────── Leads ───────────────────────────── */

export async function setLeadStatusAction(id: string, status: string) {
  await requireAdmin();
  if (!(leadStatuses as readonly string[]).includes(status)) return;
  await updateLead(id, { status: status as LeadStatus });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function saveLeadNoteAction(id: string, note: string) {
  await requireAdmin();
  await updateLead(id, { note: note.slice(0, 2000) });
  revalidatePath("/admin/leads");
}

export async function deleteLeadAction(id: string) {
  await requireAdmin();
  await deleteLead(id);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

/* ───────────────────────────── Cases ───────────────────────────── */

export async function saveCaseAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const existing = await listCaseRecords();
  const nextOrder = existing.reduce((max, c) => Math.max(max, c.order), -1) + 1;
  const parsed = parseCaseForm(form, { existing, nextOrder });
  if (!parsed.ok) return { error: parsed.error };

  const previous = existing.find((c) => c.id === parsed.record.id);
  await saveCaseRecord(parsed.record);

  // Remove images that were taken out of the case.
  if (previous) {
    const kept = new Set([parsed.record.cover, ...(parsed.record.gallery ?? [])]);
    await deleteBlobs([previous.cover, ...(previous.gallery ?? [])].filter((u): u is string => !!u && !kept.has(u)));
  }

  refreshSite();
  redirect("/admin/cases?saved=1");
}

export async function deleteCaseAction(id: string) {
  await requireAdmin();
  const record = await getCaseRecord(id);
  await deleteCaseRecord(id);
  if (record) await deleteBlobs([record.cover, ...(record.gallery ?? [])].filter((u): u is string => !!u));
  refreshSite();
  revalidatePath("/admin/cases");
}

export async function togglePublishedAction(id: string) {
  await requireAdmin();
  const record = await getCaseRecord(id);
  if (!record) return;
  await saveCaseRecord({ ...record, published: !record.published });
  refreshSite();
  revalidatePath("/admin/cases");
}

export async function moveCaseAction(id: string, direction: "up" | "down") {
  await requireAdmin();
  const records = await listCaseRecords();
  const index = records.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= records.length) return;

  const reordered: CaseRecord[] = [...records];
  [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];
  for (const [i, r] of reordered.entries()) if (r.order !== i) await saveCaseRecord({ ...r, order: i });
  refreshSite();
  revalidatePath("/admin/cases");
}

export async function importStaticCasesAction() {
  await requireAdmin();
  await seedStaticCases();
  refreshSite();
  revalidatePath("/admin/cases");
}
