import "dotenv/config";
import { db, pool } from "@/db";
import { users, projects, milestones, transactions, progressUpdates, financialLogs } from "@/db/schema";
import { generateCertificateCode } from "@/lib/certificate";
import { slugify } from "@/lib/utils";

async function main() {
  console.log("Seeding WakafTracker demo data...");

  await db.delete(progressUpdates);
  await db.delete(financialLogs);
  await db.delete(transactions);
  await db.delete(milestones);
  await db.delete(projects);
  await db.delete(users);

  const [admin, wakifBudi, wakifSiti, wakifAnon] = await db
    .insert(users)
    .values([
      { name: "Ust. Ahmad Fauzan", email: "nazhir@wakaftracker.id", role: "ADMIN_NAZHIR" },
      { name: "Budi Santoso", email: "budi@wakaftracker.id", role: "WAKIF" },
      { name: "Siti Rahma", email: "siti@wakaftracker.id", role: "WAKIF" },
      { name: "Hamba Allah", email: "anon@wakaftracker.id", role: "WAKIF" },
    ])
    .returning();

  const projectSeeds = [
    {
      title: "Pembangunan Masjid Al-Falah Desa Sukamaju",
      category: "Masjid",
      targetAmount: "750000000",
      location: "Sukamaju, Bogor, Jawa Barat",
      description:
        "Pembangunan masjid baru untuk menampung lebih dari 500 jamaah di desa yang belum memiliki fasilitas ibadah memadai. Proyek meliputi struktur utama, kubah, menara, dan area wudhu.",
      physicalProgress: 65,
      status: "ONGOING" as const,
      coverImageUrl:
        "https://images.unsplash.com/photo-1542628878-6b4e0a4edb1a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Sumur Wakaf & Instalasi Air Bersih Flores Timur",
      category: "Air Bersih",
      targetAmount: "150000000",
      location: "Flores Timur, NTT",
      description:
        "Pembangunan 5 titik sumur bor dan jaringan pipa distribusi air bersih untuk 3 dusun yang mengalami krisis air bersih setiap musim kemarau.",
      physicalProgress: 40,
      status: "ONGOING" as const,
      coverImageUrl:
        "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Wakaf Produktif Kebun Kurma Madinah Nusantara",
      category: "Wakaf Produktif",
      targetAmount: "500000000",
      collectedAmount: "500000000",
      location: "Lombok Timur, NTB",
      description:
        "Lahan kebun kurma produktif seluas 5 hektar yang hasil panennya digunakan untuk membiayai operasional panti asuhan dan beasiswa yatim secara berkelanjutan.",
      physicalProgress: 100,
      status: "COMPLETED" as const,
      coverImageUrl:
        "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Renovasi Sekolah Tahfidz Nurul Qur'an",
      category: "Pendidikan",
      targetAmount: "300000000",
      location: "Cianjur, Jawa Barat",
      description:
        "Renovasi total 6 ruang kelas, asrama santri, dan perpustakaan yang rusak akibat gempa agar kegiatan belajar mengajar tahfidz Al-Qur'an dapat berjalan dengan aman dan nyaman.",
      physicalProgress: 20,
      status: "ONGOING" as const,
      coverImageUrl:
        "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const createdProjects = [];
  for (const seed of projectSeeds) {
    const [project] = await db
      .insert(projects)
      .values({
        title: seed.title,
        slug: slugify(seed.title),
        category: seed.category,
        targetAmount: seed.targetAmount,
        collectedAmount: seed.collectedAmount ?? "0",
        physicalProgress: seed.physicalProgress,
        status: seed.status,
        location: seed.location,
        description: seed.description,
        coverImageUrl: seed.coverImageUrl,
        imageUrls: [seed.coverImageUrl],
      })
      .returning();
    createdProjects.push(project);
  }

  const [masjid, sumur, kebun, sekolah] = createdProjects;

  // Milestones
  await db.insert(milestones).values([
    { projectId: masjid.id, title: "Pembebasan & Pematangan Lahan", status: "COMPLETED", orderIndex: 0, targetCompletionDate: "2025-02-01" },
    { projectId: masjid.id, title: "Pondasi & Struktur Bawah", status: "COMPLETED", orderIndex: 1, targetCompletionDate: "2025-05-01" },
    { projectId: masjid.id, title: "Dinding & Atap Utama", status: "IN_PROGRESS", orderIndex: 2, targetCompletionDate: "2025-11-01" },
    { projectId: masjid.id, title: "Interior, Kubah & Menara", status: "PENDING", orderIndex: 3, targetCompletionDate: "2026-03-01" },
    { projectId: masjid.id, title: "Finishing & Serah Terima", status: "PENDING", orderIndex: 4, targetCompletionDate: "2026-06-01" },

    { projectId: sumur.id, title: "Survey Titik Pengeboran", status: "COMPLETED", orderIndex: 0, targetCompletionDate: "2025-04-01" },
    { projectId: sumur.id, title: "Pengeboran 5 Titik Sumur", status: "IN_PROGRESS", orderIndex: 1, targetCompletionDate: "2025-12-01" },
    { projectId: sumur.id, title: "Instalasi Pipa & Tandon", status: "PENDING", orderIndex: 2, targetCompletionDate: "2026-02-01" },

    { projectId: kebun.id, title: "Pengolahan Lahan", status: "COMPLETED", orderIndex: 0, targetCompletionDate: "2024-06-01" },
    { projectId: kebun.id, title: "Penanaman Bibit Kurma", status: "COMPLETED", orderIndex: 1, targetCompletionDate: "2024-09-01" },
    { projectId: kebun.id, title: "Panen Perdana & Distribusi Hasil", status: "COMPLETED", orderIndex: 2, targetCompletionDate: "2025-08-01" },

    { projectId: sekolah.id, title: "Asesmen Struktur Bangunan", status: "COMPLETED", orderIndex: 0, targetCompletionDate: "2025-09-01" },
    { projectId: sekolah.id, title: "Renovasi Ruang Kelas", status: "IN_PROGRESS", orderIndex: 1, targetCompletionDate: "2026-01-01" },
    { projectId: sekolah.id, title: "Renovasi Asrama & Perpustakaan", status: "PENDING", orderIndex: 2, targetCompletionDate: "2026-05-01" },
  ]);

  // Transactions (donations)
  const donors = [
    { user: wakifBudi, project: masjid, amount: "25000000", anon: false, message: "Semoga lancar pembangunannya." },
    { user: wakifSiti, project: masjid, amount: "15000000", anon: false, message: "Barakallahu fiikum." },
    { user: wakifAnon, project: masjid, amount: "5000000", anon: true, message: null },
    { user: wakifBudi, project: sumur, amount: "10000000", anon: false, message: "Semoga bermanfaat untuk warga." },
    { user: wakifSiti, project: sekolah, amount: "20000000", anon: false, message: null },
    { user: wakifBudi, project: kebun, amount: "50000000", anon: false, message: "Alhamdulillah sudah panen." },
  ];

  for (const d of donors) {
    await db.insert(transactions).values({
      projectId: d.project.id,
      userId: d.user.id,
      donorName: d.anon ? "Hamba Allah" : d.user.name,
      donorEmail: d.user.email,
      amount: d.amount,
      isAnonymous: d.anon,
      certificateCode: generateCertificateCode(),
      message: d.message,
    });
  }

  // Financial logs
  await db.insert(financialLogs).values([
    { projectId: masjid.id, title: "Pembelian Material Pondasi", category: "Material", amount: "120000000", expenseDate: "2025-03-10" },
    { projectId: masjid.id, title: "Upah Tukang Tahap Struktur", category: "Tenaga Kerja", amount: "85000000", expenseDate: "2025-06-15" },
    { projectId: masjid.id, title: "Pembelian Besi & Semen Dinding", category: "Material", amount: "60000000", expenseDate: "2025-09-05" },

    { projectId: sumur.id, title: "Sewa Alat Bor", category: "Operasional", amount: "35000000", expenseDate: "2025-07-01" },
    { projectId: sumur.id, title: "Pipa & Perlengkapan Instalasi", category: "Material", amount: "18000000", expenseDate: "2025-10-01" },

    { projectId: kebun.id, title: "Bibit Kurma Unggul", category: "Material", amount: "80000000", expenseDate: "2024-07-01" },
    { projectId: kebun.id, title: "Irigasi Tetes", category: "Infrastruktur", amount: "60000000", expenseDate: "2024-08-01" },

    { projectId: sekolah.id, title: "Asesmen & Konsultan Struktur", category: "Jasa", amount: "15000000", expenseDate: "2025-09-20" },
  ]);

  // Progress updates
  await db.insert(progressUpdates).values([
    {
      projectId: masjid.id,
      title: "Struktur dinding mulai dikerjakan",
      description: "Tim konstruksi telah menyelesaikan 40% pemasangan dinding bata pada sisi utara dan timur masjid.",
      imageUrls: ["https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=1200&auto=format&fit=crop"],
      notifiedAt: new Date(),
    },
    {
      projectId: sumur.id,
      title: "Titik pertama berhasil mengeluarkan air",
      description: "Pengeboran di titik pertama berhasil menembus sumber air pada kedalaman 45 meter dengan debit stabil.",
      imageUrls: ["https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=1200&auto=format&fit=crop"],
      notifiedAt: new Date(),
    },
  ]);

  console.log("Seed selesai:");
  console.log("- Users:", [admin, wakifBudi, wakifSiti, wakifAnon].map((u) => u.email).join(", "));
  console.log("- Projects:", createdProjects.map((p) => p.title).join(", "));
}

main()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    return pool.end().finally(() => process.exit(1));
  });
