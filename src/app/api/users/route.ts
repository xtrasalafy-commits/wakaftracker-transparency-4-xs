import { NextResponse } from "next/server";
import { listUsers } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await listUsers();
  return NextResponse.json({ data });
}
