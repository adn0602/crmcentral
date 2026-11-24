import { integer, index, numeric, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

const userRole = pgEnum("user_role", ["user", "admin"]);
const sourceKind = pgEnum("crm_source_kind", ["notion", "google_sheets", "file", "manual"]);
const dedupeState = pgEnum("crm_dedupe_status", ["clear", "review", "merged"]);
const importState = pgEnum("crm_import_status", ["preview", "approved", "completed", "failed"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export const crmSources = pgTable("crm_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  kind: sourceKind("kind").notNull(),
  externalId: varchar("externalId", { length: 255 }),
  externalUrl: text("externalUrl"),
  isPrimary: integer("isPrimary").default(0).notNull(),
  lastReadAt: timestamp("lastReadAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, table => ({ sourceExternalIdx: uniqueIndex("crm_sources_external_idx").on(table.kind, table.externalId) }));

export const crmContacts = pgTable("crm_contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 40 }),
  normalizedEmail: varchar("normalizedEmail", { length: 320 }),
  normalizedPhone: varchar("normalizedPhone", { length: 40 }),
  profile: varchar("profile", { length: 120 }),
  region: varchar("region", { length: 160 }),
  neighborhood: varchar("neighborhood", { length: 255 }),
  notes: text("notes"),
  dedupeStatus: dedupeState("dedupeStatus").default("clear").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, table => ({ emailIdx: index("crm_contacts_email_idx").on(table.normalizedEmail), phoneIdx: index("crm_contacts_phone_idx").on(table.normalizedPhone) }));

export const crmLeads = pgTable("crm_leads", {
  id: serial("id").primaryKey(),
  contactId: integer("contactId").notNull(),
  sourceId: integer("sourceId"),
  externalId: varchar("externalId", { length: 255 }),
  sourceUrl: text("sourceUrl"),
  origin: varchar("origin", { length: 120 }),
  status: varchar("status", { length: 120 }),
  stage: varchar("stage", { length: 120 }),
  temperature: varchar("temperature", { length: 80 }),
  objective: varchar("objective", { length: 160 }),
  propertyInterest: varchar("propertyInterest", { length: 255 }),
  estimatedValue: numeric("estimatedValue", { precision: 14, scale: 2 }),
  nextAction: varchar("nextAction", { length: 255 }),
  enteredAt: timestamp("enteredAt", { withTimezone: true }),
  lastInteractionAt: timestamp("lastInteractionAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, table => ({ leadExternalIdx: uniqueIndex("crm_leads_source_external_idx").on(table.sourceId, table.externalId), contactIdx: index("crm_leads_contact_idx").on(table.contactId) }));

export const crmProperties = pgTable("crm_properties", {
  id: serial("id").primaryKey(),
  sourceId: integer("sourceId"),
  externalId: varchar("externalId", { length: 255 }),
  development: varchar("development", { length: 255 }),
  developer: varchar("developer", { length: 180 }),
  neighborhood: varchar("neighborhood", { length: 180 }),
  address: text("address"),
  availability: varchar("availability", { length: 120 }),
  deliveryDate: timestamp("deliveryDate", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, table => ({ propertyExternalIdx: uniqueIndex("crm_properties_source_external_idx").on(table.sourceId, table.externalId) }));

export const crmActivities = pgTable("crm_activities", {
  id: serial("id").primaryKey(),
  contactId: integer("contactId"),
  leadId: integer("leadId"),
  sourceId: integer("sourceId"),
  externalId: varchar("externalId", { length: 255 }),
  type: varchar("type", { length: 120 }).notNull(),
  result: text("result"),
  nextAction: varchar("nextAction", { length: 255 }),
  occurredAt: timestamp("occurredAt", { withTimezone: true }),
  nextActionAt: timestamp("nextActionAt", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, table => ({ activityExternalIdx: uniqueIndex("crm_activities_source_external_idx").on(table.sourceId, table.externalId), activityContactIdx: index("crm_activities_contact_idx").on(table.contactId) }));

export const crmImports = pgTable("crm_imports", {
  id: serial("id").primaryKey(),
  sourceId: integer("sourceId").notNull(),
  status: importState("status").default("preview").notNull(),
  rowsRead: integer("rowsRead").default(0).notNull(),
  rowsImported: integer("rowsImported").default(0).notNull(),
  rowsReview: integer("rowsReview").default(0).notNull(),
  mappingJson: text("mappingJson"),
  errorMessage: text("errorMessage"),
  startedAt: timestamp("startedAt", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completedAt", { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CrmContact = typeof crmContacts.$inferSelect;
export type CrmLead = typeof crmLeads.$inferSelect;
export type CrmActivity = typeof crmActivities.$inferSelect;
export type CrmSource = typeof crmSources.$inferSelect;
