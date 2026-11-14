"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { donationSchema } from "@/lib/validations";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

export function DonationForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("100000");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ certificateCode: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = donationSchema.safeParse({
      projectId,
      donorName,
      donorEmail,
      amount,
      isAnonymous,
      message,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors({ form: json.error?.formErrors?.join(", ") ?? "Gagal memproses wakaf." });
        return;
      }
      setSuccess({ certificateCode: json.data.certificateCode });
      router.refresh();
    } catch {
      setErrors({ form: "Terjadi kesalahan jaringan. Coba lagi." });
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-600" />
        <h4 className="text-lg font-bold text-emerald-900">Jazakumullahu Khairan!</h4>
        <p className="mt-1 text-sm text-emerald-800">Wakaf Anda telah tercatat.</p>
        <p className="mt-3 text-xs text-emerald-700">Kode Sertifikat</p>
        <p className="mb-4 font-mono text-base font-bold text-emerald-900">{success.certificateCode}</p>
        <Link
          href={`/certificate/${success.certificateCode}`}
          className="inline-block rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Lihat e-Sertifikat
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Pilih Nominal Wakaf</Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              type="button"
              key={preset}
              onClick={() => setAmount(String(preset))}
              className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                Number(amount) === preset
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {preset.toLocaleString("id-ID")}
            </button>
          ))}
        </div>
        <Input
          type="number"
          min={50000}
          className="mt-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nominal lainnya"
        />
        {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
      </div>

      <div>
        <Label htmlFor="donorName">Nama Wakif</Label>
        <Input
          id="donorName"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder="Nama lengkap"
        />
        {errors.donorName && <p className="mt-1 text-xs text-red-600">{errors.donorName}</p>}
      </div>

      <div>
        <Label htmlFor="donorEmail">Email (untuk e-Sertifikat)</Label>
        <Input
          id="donorEmail"
          type="email"
          value={donorEmail}
          onChange={(e) => setDonorEmail(e.target.value)}
          placeholder="nama@email.com"
        />
        {errors.donorEmail && <p className="mt-1 text-xs text-red-600">{errors.donorEmail}</p>}
      </div>

      <div>
        <Label htmlFor="message">Doa / Pesan (opsional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tuliskan doa atau pesan Anda"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        Sembunyikan nama saya (wakaf anonim)
      </label>

      {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Tunaikan Wakaf Sekarang
      </Button>
    </form>
  );
}
