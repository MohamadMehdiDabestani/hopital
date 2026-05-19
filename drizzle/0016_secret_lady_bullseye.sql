ALTER TABLE "visitToMedicine" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "visitToMedicine" CASCADE;--> statement-breakpoint
ALTER TABLE "medicine_charges" ALTER COLUMN "expiryDate" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "medicine_charges" ADD COLUMN "suspended" boolean;--> statement-breakpoint
ALTER TABLE "visits" DROP COLUMN "extraNotes";