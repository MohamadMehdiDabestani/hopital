import "server-only";
import { MedicineAddFormValues } from "../schemas/dashboard-medicineAdd.schema";
import { db } from "@/features/core/drizzle/client";
import { medicines } from "../schemas/medicine.drizzle";
import { eq } from "drizzle-orm";
import { ActionResult } from "@/features/core";
import { DashboardMedicineAddCharges } from "../schemas/dashboard-medicineAddCharges.schema";
import { medicineCharges } from "../schemas/charges.drizzle";

export const addMedicineQuery = async (
  data: MedicineAddFormValues,
  siteId: number,
) => {
  await db.insert(medicines).values({
    name: data.name,
    form: data.form,
    siteId,
  });
};

export const updateMedicineQuery = async (
  data: MedicineAddFormValues,
  siteId: number,
): Promise<ActionResult<undefined>> => {
  if (!data.medicineId) return { ok: false, message: "دارویی انتخاب نشده" };
  await db
    .update(medicines)
    .set({
      name: data.name,
      form: data.form,
      siteId,
    })
    .where(eq(medicines.id, data.medicineId));
  return { ok: true, data: undefined };
};
export const addMedicineChargeQuery = async (
  data: DashboardMedicineAddCharges,
) => {
  await db.insert(medicineCharges).values({
    expiryDate : data.expiryDate,
    medicineId : data.medicineId,
    quantity : data.quantity,
    expiryAlertDays : data.expiryAlertDays,
    storageLocation : data.storageLocation,
    notes : data.notes,
  })
};
export const updateChargeMedicineQuery = async (
  data: DashboardMedicineAddCharges,
) => {
  await db.update(medicineCharges).set({
    expiryDate : data.expiryDate,
    quantity : data.quantity,
    expiryAlertDays : data.expiryAlertDays,
    storageLocation : data.storageLocation,
    notes : data.notes,
  }).where(eq(medicineCharges.id , data.chargeId as number))
}