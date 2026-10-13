import type { Metadata } from "next";
import Link from "next/link";
import { LeadActions } from "@/components/admin/LeadActions";
import { flagEmoji, phoneDigits } from "@/lib/contact/countries";
import { budgetLabels, countryLabel, formatDateTime, projectTypeLabels, stageLabels, statusLabels, statusStyles } from "@/lib/admin/labels";
import { leadStatuses, listLeads, type LeadStatus, type StoredLead } from "@/lib/db/leads";
import { storageEnabled } from "@/lib/db/redis";

export const metadata: Metadata = { title: "Заявки" };
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ status?: string }> };

export default async function LeadsPage({ searchParams }: PageProps) {
  const { status: statusParam } = await searchParams;
  const status = (leadStatuses as readonly string[]).includes(statusParam ?? "") ? (statusParam as LeadStatus) : "all";

  let all: StoredLead[] = [];
  let error: string | null = null;
  if (storageEnabled()) {
    try {
      all = await listLeads();
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }
  const leads = status === "all" ? all.filter((l) => l.status !== "spam") : all.filter((l) => l.status === status);
  const counts = Object.fromEntries(leadStatuses.map((s) => [s, all.filter((l) => l.status === s).length])) as Record<LeadStatus, number>;

  const tabs: { value: LeadStatus | "all"; label: string; count: number }[] = [
    { value: "all", label: "Все", count: all.length - counts.spam },
    ...leadStatuses.map((s) => ({ value: s, label: statusLabels[s], count: counts[s] })),
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Заявки</h1>
        <p className="mt-1 text-sm text-muted">Все заявки с формы сайта. Новые также приходят в Telegram.</p>
      </header>

      <nav aria-label="Фильтр по статусу" className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/admin/leads" : `/admin/leads?status=${tab.value}`}
            aria-current={status === tab.value ? "true" : undefined}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              status === tab.value ? "border-fg bg-fg text-bg" : "border-line text-muted hover:border-line-strong hover:text-fg"
            }`}
          >
            {tab.label} <span className="ml-1 tabular-nums opacity-70">{tab.count}</span>
          </Link>
        ))}
      </nav>

      {error && <p className="rounded-xl border border-red-400/30 bg-red-400/[0.06] p-4 text-sm text-red-200">Ошибка базы данных: {error}</p>}

      {leads.length === 0 ? (
        <div className="card py-16 text-center text-sm text-subtle">Заявок нет</div>
      ) : (
        <ul className="space-y-3">
          {leads.map((lead) => (
            <li key={lead.id} className="card p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs ${statusStyles[lead.status]}`}>{statusLabels[lead.status]}</span>
                    <span className="font-mono text-xs text-subtle">{lead.id}</span>
                    <span className="text-xs text-subtle">· {formatDateTime(lead.submittedAt)}</span>
                    {lead.country && (
                      <span className="text-xs text-subtle">
                        · {flagEmoji(lead.country)} {countryLabel(lead.country)}
                      </span>
                    )}
                    <span className="text-xs uppercase text-subtle">· {lead.locale}</span>
                  </div>

                  <h2 className="mt-3 text-lg font-medium text-fg">
                    {lead.name}
                    {lead.company && <span className="font-normal text-muted"> · {lead.company}</span>}
                  </h2>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                    <a href={`mailto:${lead.email}`} className="text-accent hover:underline">
                      {lead.email}
                    </a>
                    {lead.phone && (
                      <>
                        <a href={`tel:+${phoneDigits(lead.phone)}`} className="text-accent hover:underline">
                          {lead.phone}
                        </a>
                        <a href={`https://wa.me/${phoneDigits(lead.phone)}`} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg">
                          WhatsApp ↗
                        </a>
                      </>
                    )}
                  </div>

                  <dl className="mt-4 flex flex-wrap gap-2 text-xs">
                    {[projectTypeLabels[lead.projectType], stageLabels[lead.stage], budgetLabels[lead.budget]].map((v) => (
                      <dd key={v} className="rounded-md bg-surface-2 px-2 py-1 text-muted">
                        {v}
                      </dd>
                    ))}
                  </dl>

                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-fg/90">{lead.description}</p>
                </div>

                <LeadActions id={lead.id} status={lead.status} note={lead.note ?? ""} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
