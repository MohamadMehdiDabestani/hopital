import "server-only";
import { MedicineAddFormValues } from "../schemas/dashboard-medicineAdd.schema";
import { db } from "@/features/core/drizzle/client";
import { medicines } from "../schemas/medicine.drizzle";
import { eq } from "drizzle-orm";
import { ActionResult } from "@/features/core";

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
