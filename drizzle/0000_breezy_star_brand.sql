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
