CREATE TABLE "medicine_charges" (
	"id" serial PRIMARY KEY NOT NULL,
	"medicineId" integer NOT NULL,
	"expiryDate" date NOT NULL,
	"quantity" integer NOT NULL,
	"storageLocation" varchar(100),
	"expiryAlertDays" integer DEFAULT 30 NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medicines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"form" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "medicine_charges" ADD CONSTRAINT "medicine_charges_medicineId_medicines_id_fk" FOREIGN KEY ("medicineId") REFERENCES "public"."medicines"("id") ON DELETE no action ON UPDATE no action;