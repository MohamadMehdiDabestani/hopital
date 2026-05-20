CREATE TYPE "public"."form" AS ENUM('pill', 'cyrup', 'oitment', 'injection');--> statement-breakpoint
ALTER TABLE "medicines" ALTER COLUMN "form" SET DEFAULT 'pill'::"public"."form";--> statement-breakpoint
ALTER TABLE "medicines" ALTER COLUMN "form" SET DATA TYPE "public"."form" USING "form"::"public"."form";--> statement-breakpoint
ALTER TABLE "medicines" ALTER COLUMN "form" SET NOT NULL;