CREATE TABLE "recipe" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctorId" integer NOT NULL,
	"visitId" integer NOT NULL,
	"suspended" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipeToMedicine" (
	"medicineId" integer NOT NULL,
	"recipeId" integer NOT NULL,
	"chargeId" integer NOT NULL,
	"intervalMeta" integer,
	"daysPerWeekMeta" integer,
	"noteMeta" varchar(150),
	"count" integer
);
--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_doctorId_users_id_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_visitId_visits_id_fk" FOREIGN KEY ("visitId") REFERENCES "public"."visits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipeToMedicine" ADD CONSTRAINT "recipeToMedicine_medicineId_medicines_id_fk" FOREIGN KEY ("medicineId") REFERENCES "public"."medicines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipeToMedicine" ADD CONSTRAINT "recipeToMedicine_recipeId_recipe_id_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipeToMedicine" ADD CONSTRAINT "recipeToMedicine_chargeId_medicine_charges_id_fk" FOREIGN KEY ("chargeId") REFERENCES "public"."medicine_charges"("id") ON DELETE no action ON UPDATE no action;