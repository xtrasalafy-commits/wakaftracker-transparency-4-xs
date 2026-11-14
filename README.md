# WakafTracker — Dashboard Transparansi & Laporan Proyek Wakaf

Platform transparansi wakaf untuk Nazhir dan Wakif: pantau pendanaan, progres fisik, arus kas, dan e-sertifikat wakaf secara real-time.

## Fitur Utama

- **Katalog Proyek** — Daftar proyek wakaf dengan filter kategori dan status
- **Detail Proyek** — Timeline milestone, galeri foto, transparansi arus kas, dan wakif terbaru
- **Donasi Wakaf** — Form tunaikan wakaf dengan e-sertifikat otomatis
- **Portal Wakif** — Riwayat transaksi, feed update progres, dan galeri e-sertifikat per pengguna
- **Dashboard Nazhir** — Manajemen proyek, milestone, arus kas, dan progress logger
- **e-Sertifikat** — Halaman sertifikat wakaf yang dapat dicetak/unduh sebagai PDF
- **Health Check** — Endpoint `/api/health` untuk monitoring koneksi database

## Teknologi

- [Next.js 16](https://nextjs.org/) (App Router)
- [Drizzle ORM](https://orm.drizzle.team/) + [PostgreSQL](https://www.postgresql.org/) (kompatibel Neon Serverless)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React 19](https://react.dev/)
- [Recharts](https://recharts.org/) — grafik arus kas
- [Resend](https://resend.com/) — email notifikasi (opsional)
- [nanoid](https://github.com/ai/nanoid) — kode sertifikat wakaf
- [zod](https://zod.dev/) — validasi input

## Struktur Database (Neon / PostgreSQL)

Tabel utama:

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Pengguna (Nazhir dan Wakif) |
| `projects` | Proyek wakaf |
| `transactions` | Donasi / transaksi wakaf |
| `milestones` | Tahapan fisik proyek |
| `progress_updates` | Update progres lapangan |
| `financial_logs` | Log pengeluaran / arus kas |

File schema siap pakai: `database_schema_neon.sql`

## Instalasi Lokal

### Prasyarat

- Node.js 18+
- PostgreSQL (Neon atau lokal)
- npm atau yarn

### Langkah-langkah

```bash
# 1. Clone repositori
git clone https://github.com/MZF/wakaftracker-transparency-4-xs.git
cd wakaftracker-transparency-4-xs

# 2. Install dependensi
npm install

# 3. Salin contoh environment
cp .env.example .env.local

# 4. Isi DATABASE_URL di .env.local (Neon connection string)
# Contoh:
# DATABASE_URL=postgresql://neondb_owner:xxx@ep-xxx.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# 5. Inisialisasi database di Neon
# Jalankan database_schema_neon.sql di Neon SQL Editor

# 6. Jalankan development server
npm run dev

# 7. Buka http://localhost:3000
```

### Akun Demo (setelah seed database)

| Email | Role |
|-------|------|
| nazhir@wakaftracker.id | ADMIN_NAZHIR |
| budi@wakaftracker.id | WAKIF |
| siti@wakaftracker.id | WAKIF |
| anon@wakaftracker.id | WAKIF |

## Deployment ke Vercel

1. Push kode ke GitHub
2. Impor repositori di [Vercel](https://vercel.com/)
3. Tambahkan Environment Variables di Project Settings:
   - `DATABASE_URL` — connection string Neon
   - `NEXT_PUBLIC_APP_URL` — URL produksi Vercel
   - `RESEND_API_KEY` — untuk email notifikasi (opsional)
   - `RESEND_FROM_EMAIL` — alamat pengirim email
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET`, `CLOUDINARY_API_KEY` — untuk upload gambar (opsional)
4. Jalankan `database_schema_neon.sql` di Neon SQL Editor untuk inisialisasi database
5. Deploy otomatis saat push ke branch produksi

## Skrip Tersedia

```bash
npm run dev      # Jalankan development server
npm run build    # Build produksi (webpack di Windows, Turbopack di Linux)
npm run start    # Jalankan server produksi
npm run lint     # ESLint
npm run typecheck# TypeScript type check
```

## Widget Trakteer

Di sudut kanan bawah layar terdapat widget "Kopi untuk Server" untuk mendukung biaya operasional server. Nominal mulai dari Rp6.000 dengan QR Code langsung ditampilkan dalam web app tanpa berpindah halaman.

## Download Source Code

Tombol "Download Source Code" di sudut kanan bawah mengarahkan ke repositori GitHub untuk mengunduh kode lengkap sebagai ZIP atau clone via Git.

## Lisensi

Open Source oleh **MZF - 2026**

Dibangun untuk kemaslahatan umat melalui transparansi dana wakaf.
