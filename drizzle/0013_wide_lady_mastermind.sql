CREATE TABLE "tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"suspended" boolean DEFAULT false,
	"siteId" integer
);
--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_siteId_sites_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;