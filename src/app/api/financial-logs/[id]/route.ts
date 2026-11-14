import { NextRequest, NextResponse } from "next/server";
import { deleteFinancialLog } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteFinancialLog(id);
  return NextResponse.json({ ok: true });
}
