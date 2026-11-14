-- WakafTracker Database Schema for Neon (PostgreSQL)
-- Run this SQL in your Neon SQL Editor to initialize the database.
-- This matches the Drizzle ORM schema in src/db/schema.ts and seed data in src/db/seed.ts.

-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('ADMIN_NAZHIR', 'WAKIF');
CREATE TYPE project_status AS ENUM ('DRAFT', 'ONGOING', 'COMPLETED');
CREATE TYPE milestone_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- ---------------------------------------------------------------------------
-- USERS
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'WAKIF',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- PROJECTS
-- ---------------------------------------------------------------------------
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  category VARCHAR(80) NOT NULL,
  target_amount NUMERIC(16, 2) NOT NULL,
  collected_amount NUMERIC(16, 2) NOT NULL DEFAULT 0,
  physical_progress INTEGER NOT NULL DEFAULT 0,
  status project_status NOT NULL DEFAULT 'ONGOING',
  location VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- TRANSACTIONS (Wakaf donations)
-- ---------------------------------------------------------------------------
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  donor_name VARCHAR(150) NOT NULL,
  donor_email VARCHAR(180),
  amount NUMERIC(16, 2) NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  certificate_code VARCHAR(40) NOT NULL UNIQUE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- MILESTONES (Tahapan fisik proyek)
-- ---------------------------------------------------------------------------
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status milestone_status NOT NULL DEFAULT 'PENDING',
  order_index INTEGER NOT NULL DEFAULT 0,
  target_completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- PROGRESS UPDATES (bukti lapangan + broadcast notifikasi)
-- ---------------------------------------------------------------------------
CREATE TABLE progress_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- FINANCIAL LOGS (Log pengeluaran / arus kas)
-- ---------------------------------------------------------------------------
CREATE TABLE financial_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'Operasional',
  amount NUMERIC(16, 2) NOT NULL,
  expense_date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_transactions_project_id ON transactions(project_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_certificate_code ON transactions(certificate_code);
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_progress_updates_project_id ON progress_updates(project_id);
CREATE INDEX idx_financial_logs_project_id ON financial_logs(project_id);

-- ---------------------------------------------------------------------------
-- EXAMPLE DATA (seed)
-- ---------------------------------------------------------------------------

-- Users
INSERT INTO users (name, email, role) VALUES
  ('Ust. Ahmad Fauzan', 'nazhir@wakaftracker.id', 'ADMIN_NAZHIR'),
  ('Budi Santoso', 'budi@wakaftracker.id', 'WAKIF'),
  ('Siti Rahma', 'siti@wakaftracker.id', 'WAKIF'),
  ('Hamba Allah', 'anon@wakaftracker.id', 'WAKIF');

-- Projects
INSERT INTO projects (title, slug, category, target_amount, collected_amount, physical_progress, status, location, description, cover_image_url, image_urls) VALUES
  (
    'Pembangunan Masjid Al-Falah Desa Sukamaju',
    'pembangunan-masjid-al-falah-desa-sukamaju',
    'Masjid',
    '750000000',
    '0',
    65,
    'ONGOING',
    'Sukamaju, Bogor, Jawa Barat',
    'Pembangunan masjid baru untuk menampung lebih dari 500 jamaah di desa yang belum memiliki fasilitas ibadah memadai. Proyek meliputi struktur utama, kubah, menara, dan area wudhu.',
    'https://images.unsplash.com/photo-1542628878-6b4e0a4edb1a?q=80&w=1200&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1542628878-6b4e0a4edb1a?q=80&w=1200&auto=format&fit=crop"]'
  ),
  (
    'Sumur Wakaf & Instalasi Air Bersih Flores Timur',
    'sumur-wakaf-instalasi-air-bersih-flores-timur',
    'Air Bersih',
    '150000000',
    '0',
    40,
    'ONGOING',
    'Flores Timur, NTT',
    'Pembangunan 5 titik sumur bor dan jaringan pipa distribusi air bersih untuk 3 dusun yang mengalami krisis air bersih setiap musim kemarau.',
    'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=1200&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=1200&auto=format&fit=crop"]'
  ),
  (
    'Wakaf Produktif Kebun Kurma Madinah Nusantara',
    'wakaf-produktif-kebun-kurma-madinah-nusantara',
    'Wakaf Produktif',
    '500000000',
    '500000000',
    100,
    'COMPLETED',
    'Lombok Timur, NTB',
    'Lahan kebun kurma produktif seluas 5 hektar yang hasil panennya digunakan untuk membiayai operasional panti asuhan dan beasiswa yatim secara berkelanjutan.',
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1200&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1200&auto=format&fit=crop"]'
  ),
  (
    'Renovasi Sekolah Tahfidz Nurul Qur''an',
    'renovasi-sekolah-tahfidz-nurul-quran',
    'Pendidikan',
    '300000000',
    '0',
    20,
    'ONGOING',
    'Cianjur, Jawa Barat',
    'Renovasi total 6 ruang kelas, asrama santri, dan perpustakaan yang rusak akibat gempa agar kegiatan belajar mengajar tahfidz Al-Qur''an dapat berjalan dengan aman dan nyaman.',
    'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1200&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1200&auto=format&fit=crop"]'
  );

-- Capture project IDs for subsequent inserts (using CTE to reference by slug)
WITH project_ids AS (
  SELECT id, slug FROM projects
)
INSERT INTO milestones (project_id, title, description, status, order_index, target_completion_date)
SELECT p.id, m.title, m.description, m.status, m.order_index, m.target_completion_date
FROM project_ids p
CROSS JOIN (VALUES
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'Pembebasan & Pematangan Lahan', 'COMPLETED', 0, '2025-02-01'::date),
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'Pondasi & Struktur Bawah', 'COMPLETED', 1, '2025-05-01'::date),
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'Dinding & Atap Utama', 'IN_PROGRESS', 2, '2025-11-01'::date),
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'Interior, Kubah & Menara', 'PENDING', 3, '2026-03-01'::date),
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'Finishing & Serah Terima', 'PENDING', 4, '2026-06-01'::date),
  ('sumur-wakaf-instalasi-air-bersih-flores-timur', 'Survey Titik Pengeboran', 'COMPLETED', 0, '2025-04-01'::date),
  ('sumur-wakaf-instalasi-air-bersih-flores-timur', 'Pengeboran 5 Titik Sumur', 'IN_PROGRESS', 1, '2025-12-01'::date),
  ('sumur-wakaf-instalasi-air-bersih-flores-timur', 'Instalasi Pipa & Tandon', 'PENDING', 2, '2026-02-01'::date),
  ('wakaf-produktif-kebun-kurma-madinah-nusantara', 'Pengolahan Lahan', 'COMPLETED', 0, '2024-06-01'::date),
  ('wakaf-produktif-kebun-kurma-madinah-nusantara', 'Penanaman Bibit Kurma', 'COMPLETED', 1, '2024-09-01'::date),
  ('wakaf-produktif-kebun-kurma-madinah-nusantara', 'Panen Perdana & Distribusi Hasil', 'COMPLETED', 2, '2025-08-01'::date),
  ('renovasi-sekolah-tahfidz-nurul-quran', 'Asesmen Struktur Bangunan', 'COMPLETED', 0, '2025-09-01'::date),
  ('renovasi-sekolah-tahfidz-nurul-quran', 'Renovasi Ruang Kelas', 'IN_PROGRESS', 1, '2026-01-01'::date),
  ('renovasi-sekolah-tahfidz-nurul-quran', 'Renovasi Asrama & Perpustakaan', 'PENDING', 2, '2026-05-01'::date)
) AS m(slug, title, description, status, order_index, target_completion_date)
WHERE p.slug = m.slug;

-- Financial logs
WITH project_ids AS (
  SELECT id, slug FROM projects
)
INSERT INTO financial_logs (project_id, title, category, amount, expense_date, receipt_url)
SELECT p.id, f.title, f.category, f.amount, f.expense_date::date, f.receipt_url
FROM project_ids p
CROSS JOIN (VALUES
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'Pembelian Material Pondasi', 'Material', '120000000', '2025-03-10'::date, NULL),
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'Upah Tukang Tahap Struktur', 'Tenaga Kerja', '85000000', '2025-06-15'::date, NULL),
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'Pembelian Besi & Semen Dinding', 'Material', '60000000', '2025-09-05'::date, NULL),
  ('sumur-wakaf-instalasi-air-bersih-flores-timur', 'Sewa Alat Bor', 'Operasional', '35000000', '2025-07-01'::date, NULL),
  ('sumur-wakaf-instalasi-air-bersih-flores-timur', 'Pipa & Perlengkapan Instalasi', 'Material', '18000000', '2025-10-01'::date, NULL),
  ('wakaf-produktif-kebun-kurma-madinah-nusantara', 'Bibit Kurma Unggul', 'Material', '80000000', '2024-07-01'::date, NULL),
  ('wakaf-produktif-kebun-kurma-madinah-nusantara', 'Irigasi Tetes', 'Infrastruktur', '60000000', '2024-08-01'::date, NULL),
  ('renovasi-sekolah-tahfidz-nurul-quran', 'Asesmen & Konsultan Struktur', 'Jasa', '15000000', '2025-09-20'::date, NULL)
) AS f(slug, title, category, amount, expense_date, receipt_url)
WHERE p.slug = f.slug;

-- Progress updates
WITH project_ids AS (
  SELECT id, slug FROM projects
)
INSERT INTO progress_updates (project_id, title, description, image_urls, notified_at, created_at)
SELECT p.id, pu.title, pu.description, pu.image_urls::jsonb, pu.notified_at, pu.created_at
FROM project_ids p
CROSS JOIN (VALUES
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'Struktur dinding mulai dikerjakan', 'Tim konstruksi telah menyelesaikan 40% pemasangan dinding bata pada sisi utara dan timur masjid.', '["https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=1200&auto=format&fit=crop"]', NOW(), NOW()),
  ('sumur-wakaf-instalasi-air-bersih-flores-timur', 'Titik pertama berhasil mengeluarkan air', 'Pengeboran di titik pertama berhasil menembus sumber air pada kedalaman 45 meter dengan debit stabil.', '["https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=1200&auto=format&fit=crop"]', NOW(), NOW())
) AS pu(slug, title, description, image_urls, notified_at, created_at)
WHERE p.slug = pu.slug;

-- Transactions (donations)
-- Note: certificate_code values are illustrative; the app generates them via nanoid.
WITH user_ids AS (
  SELECT id, email FROM users
),
project_ids AS (
  SELECT id, slug FROM projects
)
INSERT INTO transactions (project_id, user_id, donor_name, donor_email, amount, is_anonymous, certificate_code, message, created_at)
SELECT p.id, u.id, t.donor_name, t.donor_email, t.amount, t.is_anonymous, t.certificate_code, t.message, t.created_at
FROM project_ids p
CROSS JOIN user_ids u
CROSS JOIN (VALUES
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'budi@wakaftracker.id', 'Budi Santoso', 'budi@wakaftracker.id', '25000000', FALSE, 'WKF-202606-A1B2C3D4', 'Semoga lancar pembangunannya.', NOW()),
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'siti@wakaftracker.id', 'Siti Rahma', 'siti@wakaftracker.id', '15000000', FALSE, 'WKF-202606-E5F6G7H8', 'Barakallahu fiikum.', NOW()),
  ('pembangunan-masjid-al-falah-desa-sukamaju', 'anon@wakaftracker.id', 'Hamba Allah', 'anon@wakaftracker.id', '5000000', TRUE, 'WKF-202606-I9J0K1L2', NULL, NOW()),
  ('sumur-wakaf-instalasi-air-bersih-flores-timur', 'budi@wakaftracker.id', 'Budi Santoso', 'budi@wakaftracker.id', '10000000', FALSE, 'WKF-202606-M3N4O5P6', 'Semoga bermanfaat untuk warga.', NOW()),
  ('renovasi-sekolah-tahfidz-nurul-quran', 'siti@wakaftracker.id', 'Siti Rahma', 'siti@wakaftracker.id', '20000000', FALSE, 'WKF-202606-Q7R8S9T0', NULL, NOW()),
  ('wakaf-produktif-kebun-kurma-madinah-nusantara', 'budi@wakaftracker.id', 'Budi Santoso', 'budi@wakaftracker.id', '50000000', FALSE, 'WKF-202606-U1V2W3X4', 'Alhamdulillah sudah panen.', NOW())
) AS t(slug, user_email, donor_name, donor_email, amount, is_anonymous, certificate_code, message, created_at)
WHERE p.slug = t.slug AND u.email = t.user_email;

-- ---------------------------------------------------------------------------
-- VERIFICATION QUERIES (run to confirm seed data)
-- ---------------------------------------------------------------------------
-- SELECT * FROM users;
-- SELECT title, slug, status, collected_amount, target_amount FROM projects;
-- SELECT certificate_code, donor_name, amount FROM transactions;
