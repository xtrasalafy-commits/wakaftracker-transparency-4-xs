import { NextRequest, NextResponse } from "next/server";
import {
  createProgressUpdate,
  getDonorsForProject,
  getProjectDetail,
  listProgressUpdates,
  markProgressUpdateNotified,
} from "@/lib/queries";
import { progressUpdateSchema } from "@/lib/validations";
import { sendProgressBroadcast } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await listProgressUpdates(id);
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = progressUpdateSchema.safeParse({ ...body, projectId: id });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const detail = await getProjectDetail(id);
  if (!detail) return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });

  const update = await createProgressUpdate({
    projectId: id,
    milestoneId: parsed.data.milestoneId || null,
    title: parsed.data.title,
    description: parsed.data.description,
    imageUrls: parsed.data.imageUrls ?? [],
    physicalProgress: parsed.data.physicalProgress,
  });

  let broadcast: { sent: number; mocked?: boolean; skipped?: boolean } | null = null;

  if (parsed.data.notifyDonors) {
    const donors = await getDonorsForProject(id);
    broadcast = await sendProgressBroadcast({
      recipients: donors,
      projectTitle: detail.project.title,
      updateTitle: parsed.data.title,
      updateDescription: parsed.data.description,
      projectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/projects/${detail.project.slug}`,
    });
    await markProgressUpdateNotified(update.id);
  }

  return NextResponse.json({ data: update, broadcast }, { status: 201 });
}
