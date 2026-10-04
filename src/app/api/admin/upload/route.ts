import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/auth";
import { blobEnabled, uploadImage } from "@/lib/admin/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel functions accept up to 4.5 MB per request.
const TYPES = ["image/webp", "image/jpeg", "image/png", "image/gif"];

/** POST multipart/form-data with a "file" field → { url }. Admin only. */
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Нет доступа." }, { status: 401 });
  if (!blobEnabled()) {
    return NextResponse.json(
      { error: "Хранилище картинок не подключено. В Vercel: Storage → Create → Blob, затем Redeploy." },
      { status: 503 },
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Файл не получен." }, { status: 400 });
  if (!TYPES.includes(file.type)) return NextResponse.json({ error: "Поддерживаются JPG, PNG, WebP и GIF." }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Файл больше 4 МБ." }, { status: 413 });

  try {
    return NextResponse.json({ url: await uploadImage(file) });
  } catch (error) {
    console.error("[upload]", error);
    return NextResponse.json({ error: "Не удалось загрузить файл." }, { status: 502 });
  }
}
