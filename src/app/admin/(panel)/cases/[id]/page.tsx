import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseEditor, type CaseEditorValues } from "@/components/admin/CaseEditor";
import type { CaseRecord } from "@/content/cases";
import { formatArchitecture } from "@/lib/admin/case-form";
import { blobEnabled } from "@/lib/admin/blob";
import { getCaseRecord } from "@/lib/db/cases";
import { storageEnabled } from "@/lib/db/redis";
import { locales } from "@/lib/i18n";

export const metadata: Metadata = { title: "Редактирование кейса" };
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

function toValues(record: CaseRecord | null): CaseEditorValues {
  const texts = Object.fromEntries(
    locales.map((l) => {
      const t = record?.[l];
      return [
        l,
        {
          name: t?.name ?? "",
          type: t?.type ?? "",
          summary: t?.summary ?? "",
          outcome: t?.outcome ?? "",
          challenge: t?.challenge ?? "",
          solution: t?.solution ?? "",
          architecture: formatArchitecture(t?.architecture ?? []),
          scope: (t?.scope ?? []).join("\n"),
        },
      ];
    }),
  ) as CaseEditorValues["texts"];

  return {
    id: record?.id ?? "",
    slug: record?.slug ?? "",
    kind: record?.kind ?? "product",
    preview: record?.preview ?? "board",
    published: record?.published ?? true,
    link: record?.link ?? "",
    stack: (record?.stack ?? []).join(", "),
    cover: record?.cover ?? "",
    gallery: record?.gallery ?? [],
    texts,
  };
}

export default async function EditCasePage({ params }: PageProps) {
  const { id } = await params;
  if (!storageEnabled()) notFound();

  const isNew = id === "new";
  const record = isNew ? null : await getCaseRecord(decodeURIComponent(id));
  if (!isNew && !record) notFound();

  return (
    <div className="space-y-6">
      <header>
        <Link href="/admin/cases" className="text-sm text-muted hover:text-fg">
          ← Все кейсы
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{isNew ? "Новый кейс" : record!.en.name}</h1>
      </header>
      <CaseEditor initial={toValues(record)} uploadsEnabled={blobEnabled()} />
    </div>
  );
}
