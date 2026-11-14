import { NextRequest, NextResponse } from "next/server";
import { createMilestone, listMilestones } from "@/lib/queries";
import { milestoneSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await listMilestones(id);
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = milestoneSchema.safeParse({ ...body, projectId: id });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const milestone = await createMilestone(parsed.data);
  return NextResponse.json({ data: milestone }, { status: 201 });
}
