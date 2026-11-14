import { z } from "zod";

// ---------------------------------------------------------------------------
// Donation / Wakaf form
// ---------------------------------------------------------------------------
export const donationSchema = z.object({
  projectId: z.string().uuid({ message: "Proyek tidak valid." }),
  donorName: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter.")
    .max(150, "Nama maksimal 150 karakter."),
  donorEmail: z
    .string()
    .trim()
    .email("Format email tidak valid.")
    .optional()
    .or(z.literal("")),
  amount: z.coerce
    .number({ message: "Nominal wajib berupa angka." })
    .int("Nominal harus bilangan bulat.")
    .min(50000, "Minimal wakaf Rp 50.000.")
    .max(5_000_000_000, "Nominal melebihi batas maksimal."),
  isAnonymous: z.coerce.boolean().optional().default(false),
  message: z.string().trim().max(500, "Pesan maksimal 500 karakter.").optional(),
});

export type DonationInput = z.infer<typeof donationSchema>;

// ---------------------------------------------------------------------------
// Project (Admin Nazhir)
// ---------------------------------------------------------------------------
export const projectSchema = z.object({
  title: z.string().trim().min(5, "Judul minimal 5 karakter.").max(200),
  category: z.string().trim().min(2, "Kategori wajib diisi.").max(80),
  targetAmount: z.coerce
    .number({ message: "Target dana wajib berupa angka." })
    .positive("Target dana harus lebih dari 0."),
  location: z.string().trim().min(2, "Lokasi wajib diisi.").max(200),
  description: z.string().trim().min(20, "Deskripsi minimal 20 karakter."),
  status: z.enum(["DRAFT", "ONGOING", "COMPLETED"]).optional().default("ONGOING"),
  coverImageUrl: z.string().trim().url("URL gambar tidak valid.").optional().or(z.literal("")),
  physicalProgress: z.coerce.number().int().min(0).max(100).optional().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ---------------------------------------------------------------------------
// Milestone
// ---------------------------------------------------------------------------
export const milestoneSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().trim().min(3, "Judul tahapan minimal 3 karakter.").max(200),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional().default("PENDING"),
  targetCompletionDate: z.string().trim().optional().or(z.literal("")),
  orderIndex: z.coerce.number().int().min(0).optional().default(0),
});

export type MilestoneInput = z.infer<typeof milestoneSchema>;

// ---------------------------------------------------------------------------
// Financial log (pengeluaran / arus kas)
// ---------------------------------------------------------------------------
export const financialLogSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().trim().min(3, "Judul pengeluaran minimal 3 karakter.").max(200),
  category: z.string().trim().min(2).max(80).optional().or(z.literal("")),
  amount: z.coerce
    .number({ message: "Nominal wajib berupa angka." })
    .positive("Nominal harus lebih dari 0."),
  expenseDate: z.string().trim().min(1, "Tanggal wajib diisi."),
  receiptUrl: z.string().trim().url("URL kuitansi tidak valid.").optional().or(z.literal("")),
});

export type FinancialLogInput = z.infer<typeof financialLogSchema>;

// ---------------------------------------------------------------------------
// Progress update (bukti lapangan + broadcast)
// ---------------------------------------------------------------------------
export const progressUpdateSchema = z.object({
  projectId: z.string().uuid(),
  milestoneId: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(3, "Judul update minimal 3 karakter.").max(200),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter."),
  imageUrls: z.array(z.string().url()).max(10, "Maksimal 10 foto.").optional().default([]),
  notifyDonors: z.coerce.boolean().optional().default(false),
  physicalProgress: z.coerce.number().int().min(0).max(100).optional(),
});

export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;

// ---------------------------------------------------------------------------
// File upload validation (client-side, before sending to /api/upload)
// ---------------------------------------------------------------------------
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const fileUploadSchema = z.object({
  name: z.string(),
  type: z.string().refine((t) => ACCEPTED_IMAGE_TYPES.includes(t), {
    message: "Format file harus JPG, PNG, atau WEBP.",
  }),
  size: z
    .number()
    .max(MAX_FILE_SIZE_BYTES, "Ukuran file maksimal 5MB."),
});

// ---------------------------------------------------------------------------
// Login (demo)
// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid."),
});
