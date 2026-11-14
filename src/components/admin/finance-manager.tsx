"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-uploader";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";

export interface FinancialLogRow {
  id: string;
  title: string;
  category: string;
  amount: string;
  expenseDate: string | null;
  receiptUrl: string | null;
}

export function FinanceManager({ projectId, initial }: { projectId: string; initial: FinancialLogRow[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Operasional");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [receipts, setReceipts] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title || !amount || !expenseDate) {
      setError("Judul, nominal, dan tanggal wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/financial-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          amount,
          expenseDate,
          receiptUrl: receipts[0] ?? "",
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setError(json?.error?.formErrors?.join(", ") ?? "Gagal menyimpan log pengeluaran.");
        return;
      }
      setTitle("");
      setCategory("Operasional");
      setAmount("");
      setExpenseDate("");
      setReceipts([]);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function removeLog(id: string) {
    await fetch(`/api/financial-logs/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {initial.length === 0 && <p className="text-sm text-slate-500">Belum ada log pengeluaran.</p>}
        {initial.map((log) => (
          <div key={log.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
            <div>
              <p className="font-medium text-slate-800">{log.title}</p>
              <p className="text-xs text-slate-400">
                {log.category} &bull; {formatDate(log.expenseDate)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-amber-700">{formatCurrency(log.amount)}</p>
              {log.receiptUrl && (
                <a href={log.receiptUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 underline">
                  Nota
                </a>
              )}
              <button onClick={() => removeLog(log.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-dashed border-slate-300 p-4">
        <p className="text-sm font-semibold text-slate-700">Input Pengeluaran Baru</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Judul Pengeluaran</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Pembelian material" />
          </div>
          <div>
            <Label>Kategori</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Material / Tenaga Kerja" />
          </div>
          <div>
            <Label>Nominal (Rp)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <Label>Tanggal</Label>
            <Input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Foto Kuitansi / Nota</Label>
          <ImageUploader value={receipts} onChange={setReceipts} multiple={false} label="Unggah Nota" />
        </div>
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
          Simpan Pengeluaran
        </Button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </form>
    </div>
  );
}
