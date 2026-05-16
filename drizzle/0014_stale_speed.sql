CREATE TABLE "visitToMedicine" (
	"medicineId" integer,
	"visitId" integer,
	"chargeId" integer,
	"testId" integer,
	"intervalMeta" integer,
	"daysPerWeekMeta" integer,
	"noteMeta" varchar(150),
	"count" integer,
	CONSTRAINT "services_medicine_charge_together" CHECK ((
        ("visitToMedicine"."medicineId" IS NULL AND "visitToMedicine"."chargeId" IS NULL)
        OR
        ("visitToMedicine"."medicineId" IS NOT NULL AND "visitToMedicine"."chargeId" IS NOT NULL)
      ))
);
--> statement-breakpoint
ALTER TABLE "visitToMedicine" ADD CONSTRAINT "visitToMedicine_medicineId_medicines_id_fk" FOREIGN KEY ("medicineId") REFERENCES "public"."medicines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitToMedicine" ADD CONSTRAINT "visitToMedicine_visitId_visits_id_fk" FOREIGN KEY ("visitId") REFERENCES "public"."visits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitToMedicine" ADD CONSTRAINT "visitToMedicine_chargeId_medicine_charges_id_fk" FOREIGN KEY ("chargeId") REFERENCES "public"."medicine_charges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitToMedicine" ADD CONSTRAINT "visitToMedicine_testId_tests_id_fk" FOREIGN KEY ("testId") REFERENCES "public"."tests"("id") ON DELETE no action ON UPDATE no action;