CREATE TYPE "public"."role" AS ENUM('root', 'manager', 'doctor', 'medicine', 'admision');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"createDate" timestamp with time zone DEFAULT now() NOT NULL,
	"lastLoginAt" timestamp with time zone,
	"phone_number" varchar(15) NOT NULL,
	"codeMeli" varchar(10) NOT NULL,
	"hashedPassword" text NOT NULL,
	"hashedFirstTimePassword" text,
	"forcedChangePassword" boolean DEFAULT true NOT NULL,
	"rule" "role" NOT NULL,
	"suspended" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "users_codeMeli_unique" UNIQUE("codeMeli")
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"socketId" uuid DEFAULT gen_random_uuid(),
	"userId" integer NOT NULL,
	CONSTRAINT "sites_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;