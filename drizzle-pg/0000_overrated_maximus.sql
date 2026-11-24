CREATE TABLE "crm_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"contactId" integer,
	"leadId" integer,
	"sourceId" integer,
	"externalId" varchar(255),
	"type" varchar(120) NOT NULL,
	"result" text,
	"nextAction" varchar(255),
	"occurredAt" timestamp with time zone,
	"nextActionAt" timestamp with time zone,
	"notes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(180) NOT NULL,
	"email" varchar(320),
	"phone" varchar(40),
	"normalizedEmail" varchar(320),
	"normalizedPhone" varchar(40),
	"profile" varchar(120),
	"region" varchar(160),
	"neighborhood" varchar(255),
	"notes" text,
	"dedupeStatus" "crm_dedupe_status" DEFAULT 'clear' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_imports" (
	"id" serial PRIMARY KEY NOT NULL,
	"sourceId" integer NOT NULL,
	"status" "crm_import_status" DEFAULT 'preview' NOT NULL,
	"rowsRead" integer DEFAULT 0 NOT NULL,
	"rowsImported" integer DEFAULT 0 NOT NULL,
	"rowsReview" integer DEFAULT 0 NOT NULL,
	"mappingJson" text,
	"errorMessage" text,
	"startedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"completedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "crm_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"contactId" integer NOT NULL,
	"sourceId" integer,
	"externalId" varchar(255),
	"sourceUrl" text,
	"origin" varchar(120),
	"status" varchar(120),
	"stage" varchar(120),
	"temperature" varchar(80),
	"objective" varchar(160),
	"propertyInterest" varchar(255),
	"estimatedValue" numeric(14, 2),
	"nextAction" varchar(255),
	"enteredAt" timestamp with time zone,
	"lastInteractionAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"sourceId" integer,
	"externalId" varchar(255),
	"development" varchar(255),
	"developer" varchar(180),
	"neighborhood" varchar(180),
	"address" text,
	"availability" varchar(120),
	"deliveryDate" timestamp with time zone,
	"notes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"kind" "crm_source_kind" NOT NULL,
	"externalId" varchar(255),
	"externalUrl" text,
	"isPrimary" integer DEFAULT 0 NOT NULL,
	"lastReadAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "crm_activities_source_external_idx" ON "crm_activities" USING btree ("sourceId","externalId");--> statement-breakpoint
CREATE INDEX "crm_activities_contact_idx" ON "crm_activities" USING btree ("contactId");--> statement-breakpoint
CREATE INDEX "crm_contacts_email_idx" ON "crm_contacts" USING btree ("normalizedEmail");--> statement-breakpoint
CREATE INDEX "crm_contacts_phone_idx" ON "crm_contacts" USING btree ("normalizedPhone");--> statement-breakpoint
CREATE UNIQUE INDEX "crm_leads_source_external_idx" ON "crm_leads" USING btree ("sourceId","externalId");--> statement-breakpoint
CREATE INDEX "crm_leads_contact_idx" ON "crm_leads" USING btree ("contactId");--> statement-breakpoint
CREATE UNIQUE INDEX "crm_properties_source_external_idx" ON "crm_properties" USING btree ("sourceId","externalId");--> statement-breakpoint
CREATE UNIQUE INDEX "crm_sources_external_idx" ON "crm_sources" USING btree ("kind","externalId");