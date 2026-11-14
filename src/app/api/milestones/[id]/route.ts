import { NextRequest, NextResponse } from "next/server";
import { deleteMilestone, updateMilestone } from "@/lib/queries";
import { milestoneSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = milestoneSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const milestone = await updateMilestone(id, parsed.data);
  return NextResponse.json({ data: milestone });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteMilestone(id);
  return NextResponse.json({ ok: true });
}
