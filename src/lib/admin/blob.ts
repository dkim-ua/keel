import { del, put } from "@vercel/blob";

/**
 * Image storage for case screenshots (Vercel Blob).
 * Connect it in Vercel: Storage → Create → Blob (access: Public).
 * Vercel then adds BLOB_READ_WRITE_TOKEN automatically.
 */

export function blobEnabled(): boolean {
  return !!(process.env.BLOB_READ_WRITE_TOKEN || (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID));
}

export async function uploadImage(file: File, folder = "cases"): Promise<string> {
  const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : file.type === "image/gif" ? "gif" : "jpg";
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "image";
  const result = await put(`${folder}/${base}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  return result.url;
}

/** Best-effort removal; never throws (a leftover image is better than a failed save). */
export async function deleteBlobs(urls: string[]) {
  const own = urls.filter((u) => /\.blob\.vercel-storage\.com\//.test(u));
  if (!own.length || !blobEnabled()) return;
  try {
    await del(own);
  } catch (error) {
    console.error("[blob] delete failed:", error instanceof Error ? error.message : error);
  }
}
