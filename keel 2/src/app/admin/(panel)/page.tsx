import type { Metadata } from "next";
import Link from "next/link";
import { StatsChart } from "@/components/admin/StatsChart";
import { TopList } from "@/components/admin/TopList";
import { flagEmoji } from "@/lib/contact/countries";
import { countryLabel, formatDateTime, projectTypeLabels, statusLabels, statusStyles } from "@/lib/admin/labels";
import { getStats, type Stats } from "@/lib/db/analytics";
import { leadTimestampsSince, listLeads, type StoredLead } from "@/lib/db/leads";
import { storageEnabled } from "@/lib/db/redis";

export const metadata: Metadata = { title: "Обзор" };
export const dynamic = "force-dynamic";

const ranges = [7, 30, 90] as const;

type PageProps = { searchParams: Promise<{ days?: string }> };

export default async function DashboardPage({ searchParams }: PageProps) {
  const { days: daysParam } = await searchParams;
  const days = ranges.includes(Number(daysParam) as (typeof ranges)[number]) ? Number(daysParam) : 30;

  let stats: Stats | null = null;
  let recent: StoredLead[] = [];
  let error: string | null = null;

  if (storageEnabled()) {
    try {
      const since = Date.now() - days * 86_400_000;
      const [timestamps, leads] = await Promise.all([leadTimestampsSince(since), listLeads({ limit: 5 })]);
      stats = await getStats(days, timestamps);
      recent = leads;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  const conversion = stats && stats.totals.visitors > 0 ? (stats.totals.leads / stats.totals.visitors) * 100 : 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Обзор</h1>
          <p className="mt-1 text-sm text-muted">Посещаемость сайта и заявки. Время — Киев.</p>
        </div>
        <div className="flex gap-1 rounded-full border border-line p-1" role="group" aria-label="Период">
          {ranges.map((r) => (
            <Link
              key={r}
              href={`/admin?days=${r}`}
              aria-current={r === days ? "true" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${r === days ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
            >
              {r} дней
            </Link>
          ))}
        </div>
      </header>

      {error && <p className="rounded-xl border border-red-400/30 bg-red-400/[0.06] p-4 text-sm text-red-200">Ошибка базы данных: {error}</p>}

      <section aria-label="Итоги" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Просмотры" value={stats?.totals.views} />
        <Kpi label="Посетители" value={stats?.totals.visitors} hint="уникальные за день" />
        <Kpi label="Заявки" value={stats?.totals.leads} />
        <Kpi label="Конверсия" value={stats ? `${conversion.toFixed(1)}%` : undefined} hint="заявки / посетители" />
      </section>

      <section aria-label="График" className="card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-accent/70" /> Просмотры
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-signal" /> Посетители
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rotate-45 bg-amber-300" /> Заявки
          </span>
        </div>
        <StatsChart days={stats?.days ?? []} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TopList title="Страницы" items={stats?.top.pages ?? []} />
        <TopList title="Источники" items={stats?.top.ref ?? []} empty="Прямые заходы или нет данных" />
        <TopList
          title="Страны"
          items={(stats?.top.country ?? []).map((c) => ({ ...c, name: `${flagEmoji(c.name)} ${countryLabel(c.name)}` }))}
          empty="Появятся после публикации на Vercel"
        />
        <TopList
          title="Устройства"
          items={(stats?.top.device ?? []).map((d) => ({
            ...d,
            name: ({ desktop: "Компьютер", mobile: "Телефон", tablet: "Планшет" } as Record<string, string>)[d.name] ?? d.name,
          }))}
        />
        <TopList
          title="Язык сайта"
          items={(stats?.top.lang ?? []).map((d) => ({ ...d, name: ({ en: "English", uk: "Українська" } as Record<string, string>)[d.name] ?? d.name }))}
        />
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-fg">Последние заявки</h2>
            <Link href="/admin/leads" className="text-xs text-muted hover:text-fg">
              Все →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-subtle">Пока нет заявок</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((lead) => (
                <li key={lead.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate text-fg">{lead.name}</p>
                    <p className="truncate text-xs text-subtle">
                      {projectTypeLabels[lead.projectType]} · {formatDateTime(lead.submittedAt)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.7rem] ${statusStyles[lead.status]}`}>
                    {statusLabels[lead.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value?: number | string; hint?: string }) {
  return (
    <div className="card p-4 sm:p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-fg sm:text-3xl">
        {value === undefined ? "—" : typeof value === "number" ? value.toLocaleString("ru-RU") : value}
      </p>
      {hint && <p className="mt-1 text-xs text-subtle">{hint}</p>}
    </div>
  );
}
