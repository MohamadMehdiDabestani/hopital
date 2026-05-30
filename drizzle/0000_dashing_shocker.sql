CREATE TYPE "public"."role" AS ENUM('root', 'manager', 'doctor', 'medicine', 'admision');--> statement-breakpoint
CREATE TYPE "public"."statusEnum" AS ENUM('waiting', 'treat', 'doneVisit', 'reciveMedicine', 'finish', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."form" AS ENUM('pill', 'cyrup', 'oitment', 'injection');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"createDate" timestamp with time zone DEFAULT now() NOT NULL,
	"lastLoginAt" timestamp with time zone,
	"phone_number" varchar(11) NOT NULL,
	"codeMeli" varchar(10) NOT NULL,
	"hashedPassword" text NOT NULL,
	"rule" "role" NOT NULL,
	"suspended" boolean DEFAULT false NOT NULL,
	"siteId" integer,
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "users_codeMeli_unique" UNIQUE("codeMeli")
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"socketId" uuid DEFAULT gen_random_uuid(),
	"createByUserId" integer NOT NULL,
	CONSTRAINT "sites_createByUserId_unique" UNIQUE("createByUserId")
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"codeMeli" varchar(10) NOT NULL,
	CONSTRAINT "people_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "people_codeMeli_unique" UNIQUE("codeMeli")
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"personId" integer NOT NULL,
	"siteId" integer NOT NULL,
	"doctorId" integer NOT NULL,
	"status" "statusEnum" NOT NULL,
	"extraNotes" varchar(100),
	"receptionTime" timestamp with time zone DEFAULT now() NOT NULL,
	"treatTime" timestamp with time zone,
	"exitRoomAt" timestamp with time zone,
	"reciveMedicineTime" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "medicine_charges" (
	"id" serial PRIMARY KEY NOT NULL,
	"medicineId" integer NOT NULL,
	"expiryDate" timestamp NOT NULL,
	"quantity" integer NOT NULL,
	"storageLocation" varchar(100),
	"expiryAlertDays" integer DEFAULT 30 NOT NULL,
	"notes" text,
	"suspended" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medicines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"form" "form" DEFAULT 'pill' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"siteId" integer
);
--> statement-breakpoint
CREATE TABLE "tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"suspended" boolean DEFAULT false,
	"siteId" integer
);
--> statement-breakpoint
CREATE TABLE "visitToMedicine" (
	"medicineId" integer,
	"visitId" integer,
	"chargeId" integer,
	"testId" integer,
	"intervalMeta" integer,
	"daysPerWeekMeta" integer,
	"noteMeta" varchar(150),
	"count" integer,
	CONSTRAINT "medicineOrTest" CHECK ((
        ("visitToMedicine"."medicineId" IS NOT NULL AND "visitToMedicine"."testId" IS NULL) OR
        ("visitToMedicine"."medicineId" IS NULL AND "visitToMedicine"."testId" IS NOT NULL)
      ))
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_siteId_sites_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_createByUserId_users_id_fk" FOREIGN KEY ("createByUserId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_personId_people_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_siteId_sites_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_doctorId_users_id_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medicine_charges" ADD CONSTRAINT "medicine_charges_medicineId_medicines_id_fk" FOREIGN KEY ("medicineId") REFERENCES "public"."medicines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_siteId_sites_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_siteId_sites_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitToMedicine" ADD CONSTRAINT "visitToMedicine_medicineId_medicines_id_fk" FOREIGN KEY ("medicineId") REFERENCES "public"."medicines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitToMedicine" ADD CONSTRAINT "visitToMedicine_visitId_visits_id_fk" FOREIGN KEY ("visitId") REFERENCES "public"."visits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitToMedicine" ADD CONSTRAINT "visitToMedicine_chargeId_medicine_charges_id_fk" FOREIGN KEY ("chargeId") REFERENCES "public"."medicine_charges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitToMedicine" ADD CONSTRAINT "visitToMedicine_testId_tests_id_fk" FOREIGN KEY ("testId") REFERENCES "public"."tests"("id") ON DELETE no action ON UPDATE no action;