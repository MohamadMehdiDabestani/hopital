CREATE TYPE "public"."statusEnum" AS ENUM('waiting', 'treat', 'doneVisit', 'reciveMedicine', 'finish', 'suspended');--> statement-breakpoint
CREATE TABLE "visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"personId" integer NOT NULL,
	"doctorId" integer,
	"status" "statusEnum" NOT NULL,
	"receptionTime" timestamp with time zone DEFAULT now() NOT NULL,
	"treatTime" timestamp with time zone,
	"exitRoomAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_personId_people_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_doctorId_users_id_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;