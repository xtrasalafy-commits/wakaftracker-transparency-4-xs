"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MilestoneStatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";

export interface MilestoneRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  orderIndex: number;
  targetCompletionDate: string | null;
}

export function MilestoneManager({ projectId, initial }: { projectId: string; initial: MilestoneRow[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [targetDate, setTargetDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          targetCompletionDate: targetDate,
          orderIndex: initial.length,
        }),
      });
      if (!res.ok) {
        setError("Gagal menambah tahapan.");
        return;
      }
      setTitle("");
      setDescription("");
      setStatus("PENDING");
      setTargetDate("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/milestones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  async function removeMilestone(id: string) {
    await fetch(`/api/milestones/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {initial.length === 0 && <p className="text-sm text-slate-500">Belum ada tahapan milestone.</p>}
        {initial.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
            <div>
              <p className="font-medium text-slate-800">{m.title}</p>
              <p className="text-xs text-slate-400">Target: {formatDate(m.targetCompletionDate)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={m.status} onChange={(e) => updateStatus(m.id, e.target.value)} className="h-8 w-40 text-xs">
                <option value="PENDING">Menunggu</option>
                <option value="IN_PROGRESS">Dikerjakan</option>
                <option value="COMPLETED">Selesai</option>
              </Select>
              <MilestoneStatusBadge status={m.status} />
              <button onClick={() => removeMilestone(m.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-dashed border-slate-300 p-4">
        <p className="text-sm font-semibold text-slate-700">Tambah Tahapan Baru</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Judul Tahapan</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Target Selesai</Label>
            <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Deskripsi</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </div>
        <div className="flex items-center gap-3">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
            <option value="PENDING">Menunggu</option>
            <option value="IN_PROGRESS">Dikerjakan</option>
            <option value="COMPLETED">Selesai</option>
          </Select>
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            Tambah
          </Button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </form>
    </div>
  );
}
