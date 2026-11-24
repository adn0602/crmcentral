import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar, decimal, index } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const crmSources = mysqlTable("crm_sources", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  kind: mysqlEnum("kind", ["notion", "google_sheets", "file", "manual"]).notNull(),
  externalId: varchar("externalId", { length: 255 }),
  externalUrl: text("externalUrl"),
  isPrimary: int("isPrimary").default(0).notNull(),
  lastReadAt: timestamp("lastReadAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ sourceExternalIdx: uniqueIndex("crm_sources_external_idx").on(table.kind, table.externalId) }));

export const crmContacts = mysqlTable("crm_contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 40 }),
  normalizedEmail: varchar("normalizedEmail", { length: 320 }),
  normalizedPhone: varchar("normalizedPhone", { length: 40 }),
  profile: varchar("profile", { length: 120 }),
  region: varchar("region", { length: 160 }),
  neighborhood: varchar("neighborhood", { length: 255 }),
  notes: text("notes"),
  dedupeStatus: mysqlEnum("dedupeStatus", ["clear", "review", "merged"]).default("clear").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ emailIdx: index("crm_contacts_email_idx").on(table.normalizedEmail), phoneIdx: index("crm_contacts_phone_idx").on(table.normalizedPhone) }));

export const crmLeads = mysqlTable("crm_leads", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId").notNull(),
  sourceId: int("sourceId"),
  externalId: varchar("externalId", { length: 255 }),
  sourceUrl: text("sourceUrl"),
  origin: varchar("origin", { length: 120 }),
  status: varchar("status", { length: 120 }),
  stage: varchar("stage", { length: 120 }),
  temperature: varchar("temperature", { length: 80 }),
  objective: varchar("objective", { length: 160 }),
  propertyInterest: varchar("propertyInterest", { length: 255 }),
  estimatedValue: decimal("estimatedValue", { precision: 14, scale: 2 }),
  nextAction: varchar("nextAction", { length: 255 }),
  enteredAt: timestamp("enteredAt"),
  lastInteractionAt: timestamp("lastInteractionAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ leadExternalIdx: uniqueIndex("crm_leads_source_external_idx").on(table.sourceId, table.externalId), contactIdx: index("crm_leads_contact_idx").on(table.contactId) }));

export const crmProperties = mysqlTable("crm_properties", {
  id: int("id").autoincrement().primaryKey(),
  sourceId: int("sourceId"),
  externalId: varchar("externalId", { length: 255 }),
  development: varchar("development", { length: 255 }),
  developer: varchar("developer", { length: 180 }),
  neighborhood: varchar("neighborhood", { length: 180 }),
  address: text("address"),
  availability: varchar("availability", { length: 120 }),
  deliveryDate: timestamp("deliveryDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ propertyExternalIdx: uniqueIndex("crm_properties_source_external_idx").on(table.sourceId, table.externalId) }));

export const crmActivities = mysqlTable("crm_activities", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId"),
  leadId: int("leadId"),
  sourceId: int("sourceId"),
  externalId: varchar("externalId", { length: 255 }),
  type: varchar("type", { length: 120 }).notNull(),
  result: text("result"),
  nextAction: varchar("nextAction", { length: 255 }),
  occurredAt: timestamp("occurredAt"),
  nextActionAt: timestamp("nextActionAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ activityExternalIdx: uniqueIndex("crm_activities_source_external_idx").on(table.sourceId, table.externalId), activityContactIdx: index("crm_activities_contact_idx").on(table.contactId) }));

export const crmImports = mysqlTable("crm_imports", {
  id: int("id").autoincrement().primaryKey(),
  sourceId: int("sourceId").notNull(),
  status: mysqlEnum("status", ["preview", "approved", "completed", "failed"]).default("preview").notNull(),
  rowsRead: int("rowsRead").default(0).notNull(),
  rowsImported: int("rowsImported").default(0).notNull(),
  rowsReview: int("rowsReview").default(0).notNull(),
  mappingJson: text("mappingJson"),
  errorMessage: text("errorMessage"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CrmContact = typeof crmContacts.$inferSelect;
export type CrmLead = typeof crmLeads.$inferSelect;
export type CrmActivity = typeof crmActivities.$inferSelect;
export type CrmSource = typeof crmSources.$inferSelect;
