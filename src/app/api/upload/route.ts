import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/upload";

export const dynamic = "force-dynamic";

const MAX_BASE64_LENGTH = 7_000_000; // ~5MB binary encoded as base64

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.dataUrl || typeof body.dataUrl !== "string") {
    return NextResponse.json({ error: "Payload dataUrl wajib diisi." }, { status: 400 });
  }

  if (!body.dataUrl.startsWith("data:image/")) {
    return NextResponse.json({ error: "Format file harus berupa gambar (JPG/PNG/WEBP)." }, { status: 400 });
  }

  if (body.dataUrl.length > MAX_BASE64_LENGTH) {
    return NextResponse.json({ error: "Ukuran file maksimal 5MB." }, { status: 400 });
  }

  try {
    const result = await uploadImage(body.dataUrl, body.folder ?? "wakaftracker");
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[upload] failed", error);
    return NextResponse.json({ error: "Gagal mengunggah gambar." }, { status: 500 });
  }
}
