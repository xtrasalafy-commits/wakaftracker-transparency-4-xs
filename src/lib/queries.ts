import { db } from "@/db";
import {
  projects,
  milestones,
  transactions,
  progressUpdates,
  financialLogs,
  users,
} from "@/db/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { generateCertificateCode } from "@/lib/certificate";
import { slugify } from "@/lib/utils";
import type { ProjectInput, MilestoneInput, FinancialLogInput, DonationInput } from "@/lib/validations";

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------
export async function listProjects(filters?: { status?: string; category?: string }) {
  const conditions = [];
  if (filters?.status) conditions.push(eq(projects.status, filters.status as "DRAFT" | "ONGOING" | "COMPLETED"));
  if (filters?.category) conditions.push(eq(projects.category, filters.category));

  return db
    .select()
    .from(projects)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(projects.createdAt));
}

export async function getProjectBySlug(slug: string) {
  const [project] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  if (!project) return null;
  return getProjectDetail(project.id);
}

export async function getProjectDetail(projectId: string) {
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project) return null;

  const [milestoneRows, financialRows, updateRows, txRows] = await Promise.all([
    db
      .select()
      .from(milestones)
      .where(eq(milestones.projectId, projectId))
      .orderBy(milestones.orderIndex, milestones.createdAt),
    db
      .select()
      .from(financialLogs)
      .where(eq(financialLogs.projectId, projectId))
      .orderBy(desc(financialLogs.expenseDate)),
    db
      .select()
      .from(progressUpdates)
      .where(eq(progressUpdates.projectId, projectId))
      .orderBy(desc(progressUpdates.createdAt)),
    db
      .select()
      .from(transactions)
      .where(eq(transactions.projectId, projectId))
      .orderBy(desc(transactions.createdAt)),
  ]);

  return {
    project,
    milestones: milestoneRows,
    financialLogs: financialRows,
    progressUpdates: updateRows,
    transactions: txRows,
  };
}

export async function createProject(input: ProjectInput) {
  const baseSlug = slugify(input.title);
  let slug = baseSlug;
  let suffix = 1;
  // Ensure slug uniqueness
  while ((await db.select().from(projects).where(eq(projects.slug, slug)).limit(1)).length > 0) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const [project] = await db
    .insert(projects)
    .values({
      title: input.title,
      slug,
      category: input.category,
      targetAmount: String(input.targetAmount),
      location: input.location,
      description: input.description,
      status: input.status ?? "ONGOING",
      coverImageUrl: input.coverImageUrl || null,
      physicalProgress: input.physicalProgress ?? 0,
    })
    .returning();

  return project;
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const updateValues: Record<string, unknown> = {};
  if (input.title !== undefined) updateValues.title = input.title;
  if (input.category !== undefined) updateValues.category = input.category;
  if (input.targetAmount !== undefined) updateValues.targetAmount = String(input.targetAmount);
  if (input.location !== undefined) updateValues.location = input.location;
  if (input.description !== undefined) updateValues.description = input.description;
  if (input.status !== undefined) updateValues.status = input.status;
  if (input.coverImageUrl !== undefined) updateValues.coverImageUrl = input.coverImageUrl || null;
  if (input.physicalProgress !== undefined) updateValues.physicalProgress = input.physicalProgress;

  const [project] = await db.update(projects).set(updateValues).where(eq(projects.id, id)).returning();
  return project;
}

export async function addProjectImage(projectId: string, imageUrl: string) {
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project) return null;
  const nextImages = [...(project.imageUrls ?? []), imageUrl];
  const [updated] = await db
    .update(projects)
    .set({ imageUrls: nextImages, coverImageUrl: project.coverImageUrl ?? imageUrl })
    .where(eq(projects.id, projectId))
    .returning();
  return updated;
}

// ---------------------------------------------------------------------------
// MILESTONES
// ---------------------------------------------------------------------------
export async function listMilestones(projectId: string) {
  return db
    .select()
    .from(milestones)
    .where(eq(milestones.projectId, projectId))
    .orderBy(milestones.orderIndex, milestones.createdAt);
}

export async function createMilestone(input: MilestoneInput) {
  const [milestone] = await db
    .insert(milestones)
    .values({
      projectId: input.projectId,
      title: input.title,
      description: input.description || null,
      status: input.status ?? "PENDING",
      orderIndex: input.orderIndex ?? 0,
      targetCompletionDate: input.targetCompletionDate || null,
    })
    .returning();
  return milestone;
}

export async function updateMilestone(id: string, input: Partial<MilestoneInput>) {
  const updateValues: Record<string, unknown> = {};
  if (input.title !== undefined) updateValues.title = input.title;
  if (input.description !== undefined) updateValues.description = input.description || null;
  if (input.status !== undefined) updateValues.status = input.status;
  if (input.orderIndex !== undefined) updateValues.orderIndex = input.orderIndex;
  if (input.targetCompletionDate !== undefined)
    updateValues.targetCompletionDate = input.targetCompletionDate || null;

  const [milestone] = await db.update(milestones).set(updateValues).where(eq(milestones.id, id)).returning();
  return milestone;
}

export async function deleteMilestone(id: string) {
  await db.delete(milestones).where(eq(milestones.id, id));
}

// ---------------------------------------------------------------------------
// FINANCIAL LOGS
// ---------------------------------------------------------------------------
export async function listFinancialLogs(projectId: string) {
  return db
    .select()
    .from(financialLogs)
    .where(eq(financialLogs.projectId, projectId))
    .orderBy(desc(financialLogs.expenseDate));
}

export async function createFinancialLog(input: FinancialLogInput) {
  const [log] = await db
    .insert(financialLogs)
    .values({
      projectId: input.projectId,
      title: input.title,
      category: input.category || "Operasional",
      amount: String(input.amount),
      expenseDate: input.expenseDate,
      receiptUrl: input.receiptUrl || null,
    })
    .returning();
  return log;
}

export async function deleteFinancialLog(id: string) {
  await db.delete(financialLogs).where(eq(financialLogs.id, id));
}

// ---------------------------------------------------------------------------
// PROGRESS UPDATES
// ---------------------------------------------------------------------------
export async function listProgressUpdates(projectId: string) {
  return db
    .select()
    .from(progressUpdates)
    .where(eq(progressUpdates.projectId, projectId))
    .orderBy(desc(progressUpdates.createdAt));
}

export async function createProgressUpdate(input: {
  projectId: string;
  milestoneId?: string | null;
  title: string;
  description: string;
  imageUrls: string[];
  physicalProgress?: number;
}) {
  const [update] = await db
    .insert(progressUpdates)
    .values({
      projectId: input.projectId,
      milestoneId: input.milestoneId || null,
      title: input.title,
      description: input.description,
      imageUrls: input.imageUrls,
    })
    .returning();

  if (typeof input.physicalProgress === "number") {
    await db
      .update(projects)
      .set({ physicalProgress: input.physicalProgress })
      .where(eq(projects.id, input.projectId));
  }

  return update;
}

export async function markProgressUpdateNotified(id: string) {
  await db.update(progressUpdates).set({ notifiedAt: new Date() }).where(eq(progressUpdates.id, id));
}

export async function getDonorsForProject(projectId: string) {
  const rows = await db
    .select({
      donorName: transactions.donorName,
      donorEmail: transactions.donorEmail,
      isAnonymous: transactions.isAnonymous,
    })
    .from(transactions)
    .where(eq(transactions.projectId, projectId));

  const seen = new Set<string>();
  return rows
    .filter((r) => r.donorEmail && !seen.has(r.donorEmail) && seen.add(r.donorEmail))
    .map((r) => ({ email: r.donorEmail as string, name: r.isAnonymous ? "Wakif" : r.donorName }));
}

// ---------------------------------------------------------------------------
// TRANSACTIONS / DONATIONS
// ---------------------------------------------------------------------------
export async function createTransaction(input: DonationInput & { userId?: string | null }) {
  let certificateCode = generateCertificateCode();
  // Guarantee uniqueness (astronomically unlikely to collide, but be safe).
  while ((await db.select().from(transactions).where(eq(transactions.certificateCode, certificateCode)).limit(1)).length > 0) {
    certificateCode = generateCertificateCode();
  }

  const [tx] = await db
    .insert(transactions)
    .values({
      projectId: input.projectId,
      userId: input.userId || null,
      donorName: input.donorName,
      donorEmail: input.donorEmail || null,
      amount: String(input.amount),
      isAnonymous: input.isAnonymous ?? false,
      certificateCode,
      message: input.message || null,
    })
    .returning();

  await db
    .update(projects)
    .set({ collectedAmount: sql`${projects.collectedAmount} + ${input.amount}` })
    .where(eq(projects.id, input.projectId));

  return tx;
}

export async function getCertificateByCode(code: string) {
  const [tx] = await db.select().from(transactions).where(eq(transactions.certificateCode, code)).limit(1);
  if (!tx) return null;
  const [project] = await db.select().from(projects).where(eq(projects.id, tx.projectId)).limit(1);
  return { transaction: tx, project };
}

export async function listProgressUpdatesForProjects(projectIds: string[]) {
  if (projectIds.length === 0) return [];
  const rows = await db
    .select({ update: progressUpdates, project: projects })
    .from(progressUpdates)
    .innerJoin(projects, eq(progressUpdates.projectId, projects.id))
    .where(inArray(progressUpdates.projectId, projectIds))
    .orderBy(desc(progressUpdates.createdAt));
  return rows;
}

export async function listTransactionsByUserEmail(email: string) {
  const rows = await db
    .select({
      transaction: transactions,
      project: projects,
    })
    .from(transactions)
    .innerJoin(projects, eq(transactions.projectId, projects.id))
    .where(eq(transactions.donorEmail, email))
    .orderBy(desc(transactions.createdAt));
  return rows;
}

// ---------------------------------------------------------------------------
// USERS
// ---------------------------------------------------------------------------
export async function listUsers() {
  return db.select().from(users).orderBy(users.createdAt);
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user ?? null;
}

// ---------------------------------------------------------------------------
// DASHBOARD STATS
// ---------------------------------------------------------------------------
export async function getAdminStats() {
  const [projectRows, txRows, logRows] = await Promise.all([
    db.select().from(projects),
    db.select().from(transactions),
    db.select().from(financialLogs),
  ]);

  const totalCollected = projectRows.reduce((sum, p) => sum + Number(p.collectedAmount), 0);
  const totalTarget = projectRows.reduce((sum, p) => sum + Number(p.targetAmount), 0);
  const totalExpense = logRows.reduce((sum, l) => sum + Number(l.amount), 0);
  const ongoingProjects = projectRows.filter((p) => p.status === "ONGOING").length;

  return {
    totalProjects: projectRows.length,
    ongoingProjects,
    totalDonors: new Set(txRows.map((t) => t.donorEmail ?? t.donorName)).size,
    totalTransactions: txRows.length,
    totalCollected,
    totalTarget,
    totalExpense,
    netBalance: totalCollected - totalExpense,
  };
}
