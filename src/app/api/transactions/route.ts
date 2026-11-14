import { NextRequest, NextResponse } from "next/server";
import { createTransaction, getUserByEmail, listTransactionsByUserEmail } from "@/lib/queries";
import { donationSchema } from "@/lib/validations";
import { sendDonationReceiptEmail } from "@/lib/email";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Parameter email wajib diisi." }, { status: 400 });

  const data = await listTransactionsByUserEmail(email);
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = donationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existingUser = parsed.data.donorEmail ? await getUserByEmail(parsed.data.donorEmail) : null;

  const transaction = await createTransaction({
    ...parsed.data,
    userId: existingUser?.id ?? null,
  });

  if (parsed.data.donorEmail) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    await sendDonationReceiptEmail({
      to: parsed.data.donorEmail,
      donorName: parsed.data.donorName,
      projectTitle: "proyek wakaf pilihan Anda",
      amount: formatCurrency(parsed.data.amount),
      certificateCode: transaction.certificateCode,
      certificateUrl: `${appUrl}/certificate/${transaction.certificateCode}`,
    });
  }

  return NextResponse.json({ data: transaction }, { status: 201 });
}
