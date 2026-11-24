CREATE TABLE `crm_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactId` int,
	`leadId` int,
	`sourceId` int,
	`externalId` varchar(255),
	`type` varchar(120) NOT NULL,
	`result` text,
	`nextAction` varchar(255),
	`occurredAt` timestamp,
	`nextActionAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `crm_activities_id` PRIMARY KEY(`id`),
	CONSTRAINT `crm_activities_source_external_idx` UNIQUE(`sourceId`,`externalId`)
);
--> statement-breakpoint
CREATE TABLE `crm_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`email` varchar(320),
	`phone` varchar(40),
	`normalizedEmail` varchar(320),
	`normalizedPhone` varchar(40),
	`profile` varchar(120),
	`region` varchar(160),
	`neighborhood` varchar(255),
	`notes` text,
	`dedupeStatus` enum('clear','review','merged') NOT NULL DEFAULT 'clear',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_imports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` int NOT NULL,
	`status` enum('preview','approved','completed','failed') NOT NULL DEFAULT 'preview',
	`rowsRead` int NOT NULL DEFAULT 0,
	`rowsImported` int NOT NULL DEFAULT 0,
	`rowsReview` int NOT NULL DEFAULT 0,
	`mappingJson` text,
	`errorMessage` text,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `crm_imports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactId` int NOT NULL,
	`sourceId` int,
	`externalId` varchar(255),
	`sourceUrl` text,
	`origin` varchar(120),
	`status` varchar(120),
	`stage` varchar(120),
	`temperature` varchar(80),
	`objective` varchar(160),
	`propertyInterest` varchar(255),
	`estimatedValue` decimal(14,2),
	`nextAction` varchar(255),
	`enteredAt` timestamp,
	`lastInteractionAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `crm_leads_source_external_idx` UNIQUE(`sourceId`,`externalId`)
);
--> statement-breakpoint
CREATE TABLE `crm_properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` int,
	`externalId` varchar(255),
	`development` varchar(255),
	`developer` varchar(180),
	`neighborhood` varchar(180),
	`address` text,
	`availability` varchar(120),
	`deliveryDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_properties_id` PRIMARY KEY(`id`),
	CONSTRAINT `crm_properties_source_external_idx` UNIQUE(`sourceId`,`externalId`)
);
--> statement-breakpoint
CREATE TABLE `crm_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`kind` enum('notion','google_sheets','file','manual') NOT NULL,
	`externalId` varchar(255),
	`externalUrl` text,
	`isPrimary` int NOT NULL DEFAULT 0,
	`lastReadAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `crm_sources_external_idx` UNIQUE(`kind`,`externalId`)
);
--> statement-breakpoint
CREATE INDEX `crm_activities_contact_idx` ON `crm_activities` (`contactId`);--> statement-breakpoint
CREATE INDEX `crm_contacts_email_idx` ON `crm_contacts` (`normalizedEmail`);--> statement-breakpoint
CREATE INDEX `crm_contacts_phone_idx` ON `crm_contacts` (`normalizedPhone`);--> statement-breakpoint
CREATE INDEX `crm_leads_contact_idx` ON `crm_leads` (`contactId`);