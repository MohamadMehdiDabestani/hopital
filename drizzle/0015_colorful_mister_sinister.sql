ALTER TABLE "visitToMedicine" DROP CONSTRAINT "services_medicine_charge_together";--> statement-breakpoint
ALTER TABLE "visitToMedicine" ADD CONSTRAINT "medicineOrTest" CHECK ((
        ("visitToMedicine"."medicineId" IS NOT NULL AND "visitToMedicine"."testId" IS NULL) OR
        ("visitToMedicine"."medicineId" IS NULL AND "visitToMedicine"."testId" IS NOT NULL)
      ));