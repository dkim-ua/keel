import type { Metadata } from "next";
import Link from "next/link";
import { CaseRowActions } from "@/components/admin/CaseRowActions";
import { ImportCasesButton } from "@/components/admin/ImportCasesButton";
import { buttonClasses } from "@/components/ui/Button";
import { staticCaseRecords, type CaseRecord } from "@/content/cases";
import { kindLabels } from "@/lib/admin/labels";
import { listCaseRecords } from "@/lib/db/cases";
import { storageEnabled } from "@/lib/db/redis";

export const metadata: Metadata = { title: "Кейсы" };
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ saved?: string }> };

export default async function CasesPage({ searchParams }: PageProps) {
  const { saved } = await searchParams;
  const enabled = storageEnabled();
  let records: CaseRecord[] = [];
  let error: string | null = null;
  if (enabled) {
    try {
      records = await listCaseRecords();
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Кейсы</h1>
          <p className="mt-1 text-sm text-muted">Проекты в разделе «Selected work». Изменения появляются на сайте сразу после сохранения.</p>
        </div>
        {enabled && (
          <Link href="/admin/cases/new" className={buttonClasses("primary", "md")}>
            + Добавить кейс
          </Link>
        )}
      </header>

      {saved && <p className="rounded-xl border border-signal/30 bg-signal/[0.06] p-4 text-sm text-signal">Кейс сохранён и опубликован на сайте.</p>}
      {error && <p className="rounded-xl border border-red-400/30 bg-red-400/[0.06] p-4 text-sm text-red-200">Ошибка базы данных: {error}</p>}

      {enabled && !error && records.length === 0 && (
        <div className="card space-y-4 p-6 text-sm leading-relaxed text-muted">
          <p>
            Сейчас на сайте показаны <b className="text-fg">{staticCaseRecords().length} встроенных концепт-кейса</b>. Как только вы
            добавите первый свой кейс, сайт начнёт показывать только кейсы из этого списка.
          </p>
          <p>Чтобы оставить концепты рядом со своими проектами (и иметь возможность их редактировать или удалить), импортируйте их:</p>
          <ImportCasesButton />
        </div>
      )}

      {records.length > 0 && (
        <ul className="space-y-2">
          {records.map((record, index) => (
            <li key={record.id} className={`card flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${record.published ? "" : "opacity-60"}`}>
              <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-bg">
                {record.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                  <img src={record.cover} alt="" className="size-full object-cover object-top" />
                ) : (
                  <div className="bg-grid size-full opacity-60" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-medium text-fg">{record.en.name}</h2>
                  <span className="rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-muted">{kindLabels[record.kind]}</span>
                  {!record.published && <span className="rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-subtle">Скрыт</span>}
                  {!record.uk.name && <span className="rounded-full border border-amber-300/40 px-2 py-0.5 text-[0.7rem] text-amber-200">Нет перевода UA</span>}
                </div>
                <p className="mt-1 truncate text-sm text-subtle">
                  /work/{record.slug} · {record.en.type}
                </p>
              </div>
              <CaseRowActions id={record.id} slug={record.slug} published={record.published} isFirst={index === 0} isLast={index === records.length - 1} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
