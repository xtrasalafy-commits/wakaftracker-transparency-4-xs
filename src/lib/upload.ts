const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;

export interface UploadResult {
  url: string;
  provider: "cloudinary" | "local-mock";
}

/**
 * Integration-ready image upload helper.
 *
 * - If CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET are configured, the
 *   base64 payload is uploaded to Cloudinary's unsigned upload endpoint.
 * - Otherwise, it falls back to returning the base64 data URI directly so
 *   the full product flow (receipts, milestone photos, certificates) keeps
 *   working end-to-end in local/dev environments without external services.
 *
 * Swap this implementation for Uploadthing by replacing the body of this
 * function with `utapi.uploadFiles(...)` once UPLOADTHING_SECRET is set.
 */
export async function uploadImage(dataUrl: string, folder = "wakaftracker"): Promise<UploadResult> {
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET) {
    const form = new FormData();
    form.append("file", dataUrl);
    form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    form.append("folder", folder);
    if (CLOUDINARY_API_KEY) form.append("api_key", CLOUDINARY_API_KEY);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: form }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cloudinary upload failed: ${text}`);
    }

    const json = (await response.json()) as { secure_url: string };
    return { url: json.secure_url, provider: "cloudinary" };
  }

  // Local/dev fallback: persist the data URI itself (demo-grade storage).
  return { url: dataUrl, provider: "local-mock" };
}
