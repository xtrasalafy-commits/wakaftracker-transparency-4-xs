import { NextRequest, NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/queries";
import { projectSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  const data = await listProjects({ status, category });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const project = await createProject(parsed.data);
  return NextResponse.json({ data: project }, { status: 201 });
}
