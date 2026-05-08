ALTER TABLE "users" RENAME COLUMN "site_id" TO "siteId";--> statement-breakpoint
ALTER TABLE "sites" RENAME COLUMN "userId" TO "createByUserId";--> statement-breakpoint
ALTER TABLE "sites" DROP CONSTRAINT "sites_userId_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_site_id_sites_id_fk";
--> statement-breakpoint
ALTER TABLE "sites" DROP CONSTRAINT "sites_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_siteId_sites_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_createByUserId_users_id_fk" FOREIGN KEY ("createByUserId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_createByUserId_unique" UNIQUE("createByUserId");