import { NextRequest, NextResponse } from "next/server";
import { getCertificateByCode } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await getCertificateByCode(code);
  if (!data || !data.project) return NextResponse.json({ error: "Sertifikat tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ data });
}
