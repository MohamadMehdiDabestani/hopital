DROP TABLE "medicine_charges" CASCADE;--> statement-breakpoint
DROP TABLE "medicines" CASCADE;--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "extraNotes" varchar(100);