import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { requireAdmin } from "@/lib/admin/auth";
import { blobEnabled } from "@/lib/admin/blob";
import { storageEnabled } from "@/lib/db/redis";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      <AdminNav />
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <SetupNotice storage={storageEnabled()} blob={blobEnabled()} />
          {children}
        </div>
      </main>
    </div>
  );
}
