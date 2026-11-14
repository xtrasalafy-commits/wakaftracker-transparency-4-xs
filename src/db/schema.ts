import {
  pgTable,
  uuid,
  text,
  varchar,
  numeric,
  integer,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// ENUMS
// ---------------------------------------------------------------------------
export const userRoleEnum = pgEnum("user_role", ["ADMIN_NAZHIR", "WAKIF"]);

export const projectStatusEnum = pgEnum("project_status", [
  "DRAFT",
  "ONGOING",
  "COMPLETED",
]);

export const milestoneStatusEnum = pgEnum("milestone_status", [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
]);

// ---------------------------------------------------------------------------
// USERS
// ---------------------------------------------------------------------------
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 180 }).notNull().unique(),
  role: userRoleEnum("role").notNull().default("WAKIF"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
}));

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  category: varchar("category", { length: 80 }).notNull(),
  targetAmount: numeric("target_amount", { precision: 16, scale: 2 }).notNull(),
  collectedAmount: numeric("collected_amount", { precision: 16, scale: 2 })
    .notNull()
    .default("0"),
  physicalProgress: integer("physical_progress").notNull().default(0),
  status: projectStatusEnum("status").notNull().default("ONGOING"),
  location: varchar("location", { length: 200 }).notNull(),
  description: text("description").notNull(),
  coverImageUrl: text("cover_image_url"),
  imageUrls: jsonb("image_urls").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  milestones: many(milestones),
  transactions: many(transactions),
  progressUpdates: many(progressUpdates),
  financialLogs: many(financialLogs),
}));

// ---------------------------------------------------------------------------
// TRANSACTIONS (Wakaf donations)
// ---------------------------------------------------------------------------
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  donorName: varchar("donor_name", { length: 150 }).notNull(),
  donorEmail: varchar("donor_email", { length: 180 }),
  amount: numeric("amount", { precision: 16, scale: 2 }).notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  certificateCode: varchar("certificate_code", { length: 40 }).notNull().unique(),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  project: one(projects, {
    fields: [transactions.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

// ---------------------------------------------------------------------------
// MILESTONES (Tahapan fisik proyek)
// ---------------------------------------------------------------------------
export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  status: milestoneStatusEnum("status").notNull().default("PENDING"),
  orderIndex: integer("order_index").notNull().default(0),
  targetCompletionDate: date("target_completion_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const milestonesRelations = relations(milestones, ({ one, many }) => ({
  project: one(projects, {
    fields: [milestones.projectId],
    references: [projects.id],
  }),
  progressUpdates: many(progressUpdates),
}));

// ---------------------------------------------------------------------------
// PROGRESS UPDATES (bukti lapangan + broadcast notifikasi)
// ---------------------------------------------------------------------------
export const progressUpdates = pgTable("progress_updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  milestoneId: uuid("milestone_id").references(() => milestones.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  imageUrls: jsonb("image_urls").$type<string[]>().notNull().default([]),
  notifiedAt: timestamp("notified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const progressUpdatesRelations = relations(progressUpdates, ({ one }) => ({
  project: one(projects, {
    fields: [progressUpdates.projectId],
    references: [projects.id],
  }),
  milestone: one(milestones, {
    fields: [progressUpdates.milestoneId],
    references: [milestones.id],
  }),
}));

// ---------------------------------------------------------------------------
// FINANCIAL LOGS (Log pengeluaran / arus kas)
// ---------------------------------------------------------------------------
export const financialLogs = pgTable("financial_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 80 }).notNull().default("Operasional"),
  amount: numeric("amount", { precision: 16, scale: 2 }).notNull(),
  expenseDate: date("expense_date").notNull(),
  receiptUrl: text("receipt_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const financialLogsRelations = relations(financialLogs, ({ one }) => ({
  project: one(projects, {
    fields: [financialLogs.projectId],
    references: [projects.id],
  }),
}));
