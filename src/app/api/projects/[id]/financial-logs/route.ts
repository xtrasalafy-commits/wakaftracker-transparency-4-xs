import { NextRequest, NextResponse } from "next/server";
import { createFinancialLog, listFinancialLogs } from "@/lib/queries";
import { financialLogSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await listFinancialLogs(id);
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = financialLogSchema.safeParse({ ...body, projectId: id });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const log = await createFinancialLog(parsed.data);
  return NextResponse.json({ data: log }, { status: 201 });
}
