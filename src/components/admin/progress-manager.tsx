"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-uploader";
import { ProgressFeed, type ProgressUpdateData } from "@/components/progress-feed";
import { BellRing, Loader2, UploadCloud } from "lucide-react";

export interface MilestoneOption {
  id: string;
  title: string;
}

export function ProgressManager({
  projectId,
  milestoneOptions,
  initial,
}: {
  projectId: string;
  milestoneOptions: MilestoneOption[];
  initial: ProgressUpdateData[];
}) {
  const router = useRouter();
  const [milestoneId, setMilestoneId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [physicalProgress, setPhysicalProgress] = useState("");
  const [notifyDonors, setNotifyDonors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!title || description.length < 10) {
      setError("Judul wajib diisi dan deskripsi minimal 10 karakter.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/progress-updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneId: milestoneId || undefined,
          title,
          description,
          imageUrls: images,
          notifyDonors,
          physicalProgress: physicalProgress ? Number(physicalProgress) : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError("Gagal menyimpan update progres.");
        return;
      }
      if (json.broadcast?.sent) {
        setNotice(`Notifikasi broadcast terkirim ke ${json.broadcast.sent} wakif.`);
      }
      setMilestoneId("");
      setTitle("");
      setDescription("");
      setImages([]);
      setPhysicalProgress("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <ProgressFeed updates={initial} />

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-dashed border-slate-300 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <UploadCloud className="h-4 w-4" /> Upload Bukti Lapangan / Milestone Logger
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Kaitkan Milestone (opsional)</Label>
            <Select value={milestoneId} onChange={(e) => setMilestoneId(e.target.value)}>
              <option value="">- Tidak terkait milestone -</option>
              {milestoneOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Update Progres Fisik (%)</Label>
            <Input type="number" min={0} max={100} value={physicalProgress} onChange={(e) => setPhysicalProgress(e.target.value)} placeholder="Opsional" />
          </div>
        </div>
        <div>
          <Label>Judul Update</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Struktur atap selesai 50%" />
        </div>
        <div>
          <Label>Deskripsi</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>
        <div>
          <Label>Foto Bukti Lapangan</Label>
          <ImageUploader value={images} onChange={setImages} multiple label="Unggah Foto" />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={notifyDonors}
            onChange={(e) => setNotifyDonors(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <BellRing className="h-4 w-4 text-emerald-600" /> Kirim notifikasi broadcast ke seluruh wakif proyek ini
        </label>
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Publikasikan Update
        </Button>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {notice && <p className="text-xs font-medium text-emerald-700">{notice}</p>}
      </form>
    </div>
  );
}
