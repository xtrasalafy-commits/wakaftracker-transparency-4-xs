import { NextRequest, NextResponse } from "next/server";
import { getProjectDetail, updateProject } from "@/lib/queries";
import { projectSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProjectDetail(id);
  if (!detail) return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ data: detail });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = projectSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const project = await updateProject(id, parsed.data);
  return NextResponse.json({ data: project });
}
