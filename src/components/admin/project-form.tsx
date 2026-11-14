"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { projectSchema } from "@/lib/validations";
import { Loader2, Save } from "lucide-react";

export interface ProjectFormValues {
  id?: string;
  title: string;
  category: string;
  targetAmount: string;
  location: string;
  description: string;
  status: "DRAFT" | "ONGOING" | "COMPLETED";
  coverImageUrl: string;
  physicalProgress: number;
}

export function ProjectForm({ initial }: { initial?: ProjectFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [values, setValues] = useState<ProjectFormValues>(
    initial ?? {
      title: "",
      category: "",
      targetAmount: "",
      location: "",
      description: "",
      status: "ONGOING",
      coverImageUrl: "",
      physicalProgress: 0,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = projectSchema.safeParse(values);
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
      const res = await fetch(isEdit ? `/api/projects/${initial!.id}` : "/api/projects", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors({ form: "Gagal menyimpan proyek." });
        return;
      }
      if (isEdit) {
        router.refresh();
      } else {
        router.push(`/admin/projects/${json.data.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Judul Proyek</Label>
          <Input id="title" value={values.title} onChange={(e) => update("title", e.target.value)} />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Input id="category" value={values.category} onChange={(e) => update("category", e.target.value)} placeholder="Masjid, Pendidikan, dsb." />
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </div>
        <div>
          <Label htmlFor="targetAmount">Target Dana (Rp)</Label>
          <Input
            id="targetAmount"
            type="number"
            value={values.targetAmount}
            onChange={(e) => update("targetAmount", e.target.value)}
          />
          {errors.targetAmount && <p className="mt-1 text-xs text-red-600">{errors.targetAmount}</p>}
        </div>
        <div>
          <Label htmlFor="location">Lokasi</Label>
          <Input id="location" value={values.location} onChange={(e) => update("location", e.target.value)} />
          {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" value={values.status} onChange={(e) => update("status", e.target.value as ProjectFormValues["status"])}>
            <option value="DRAFT">Draft</option>
            <option value="ONGOING">Berjalan</option>
            <option value="COMPLETED">Selesai</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="physicalProgress">Progres Fisik (%)</Label>
          <Input
            id="physicalProgress"
            type="number"
            min={0}
            max={100}
            value={values.physicalProgress}
            onChange={(e) => update("physicalProgress", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="coverImageUrl">URL Foto Sampul</Label>
        <Input
          id="coverImageUrl"
          value={values.coverImageUrl}
          onChange={(e) => update("coverImageUrl", e.target.value)}
          placeholder="https://..."
        />
        {errors.coverImageUrl && <p className="mt-1 text-xs text-red-600">{errors.coverImageUrl}</p>}
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          rows={5}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {isEdit ? "Simpan Perubahan" : "Buat Proyek"}
      </Button>
    </form>
  );
}
