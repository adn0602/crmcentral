import { count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, crmActivities, crmContacts, crmLeads, crmSources, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { prepare: false });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    updateSet.updatedAt = new Date();
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listCrmContacts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmContacts).orderBy(desc(crmContacts.updatedAt)).limit(500);
}

export async function listCrmLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmLeads).orderBy(desc(crmLeads.updatedAt)).limit(500);
}

export async function listCrmActivities() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmActivities).orderBy(desc(crmActivities.occurredAt)).limit(500);
}

export async function listCrmSources() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmSources).orderBy(desc(crmSources.updatedAt));
}

export async function getCrmCounts() {
  const db = await getDb();
  if (!db) return { contacts: 0, leads: 0, activities: 0, sources: 0 };
  try {
    const [contacts, leads, activities, sources] = await Promise.all([
      db.select({ value: count() }).from(crmContacts),
      db.select({ value: count() }).from(crmLeads),
      db.select({ value: count() }).from(crmActivities),
      db.select({ value: count() }).from(crmSources),
    ]);
    return {
      contacts: contacts[0]?.value ?? 0,
      leads: leads[0]?.value ?? 0,
      activities: activities[0]?.value ?? 0,
      sources: sources[0]?.value ?? 0,
    };
  } catch (error) {
    const detail = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          code: "code" in error ? error.code : undefined,
          cause: error.cause instanceof Error ? error.cause.message : undefined,
        }
      : { message: String(error) };
    console.error("[Database] CRM counts query failed:", JSON.stringify(detail));
    throw error;
  }
}
