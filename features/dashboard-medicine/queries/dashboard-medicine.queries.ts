import "server-only";
import { MedicineAddFormValues } from "../schemas/dashboard-medicineAdd.schema";
import { db } from "@/features/core/drizzle/client";
import { medicines } from "../schemas/medicine.drizzle";
import { and, eq, gte, sql } from "drizzle-orm";
import { ActionResult } from "@/features/core";
import { DashboardMedicineAddCharges } from "../schemas/dashboard-medicineAddCharges.schema";
import { medicineCharges } from "../schemas/charges.drizzle";
import { visits } from "@/features/dasboard-admision/schemas/visits.drizzle";
import { people } from "@/features/dashboard-manager/schemas/people.drizzle";
import { visitToMedicine } from "../schemas/visitToMedicine.relations.drizzle";
import { DashboardMedicineSchema } from "../schemas/dashboard-medicine.schema";

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
      isActive : data.isActive,
      siteId,
    })
    .where(eq(medicines.id, data.medicineId));
  return { ok: true, data: undefined };
};
export const addMedicineChargeQuery = async (
  data: DashboardMedicineAddCharges,
) => {
  await db.insert(medicineCharges).values({
    expiryDate: data.expiryDate,
    medicineId: data.medicineId,
    quantity: data.quantity,
    expiryAlertDays: data.expiryAlertDays,
    storageLocation: data.storageLocation,
    notes: data.notes,
  });
};
export const updateChargeMedicineQuery = async (
  data: DashboardMedicineAddCharges,
) => {
  await db
    .update(medicineCharges)
    .set({
      expiryDate: data.expiryDate,
      quantity: data.quantity,
      expiryAlertDays: data.expiryAlertDays,
      storageLocation: data.storageLocation,
      notes: data.notes,
    })
    .where(eq(medicineCharges.id, data.chargeId as number));
};

export const getMedicineQueueQuery = async (siteId: number) => {
  const data = await db
    .select({
      id: visits.id,
      fullName: sql<string>`concat(${people.firstName}, ' ', ${people.lastName})`,
      codeMeli: people.codeMeli,
      receptionTime: sql<string>`${visits.receptionTime}::text`,
      treatTime: sql<string>`${visits.treatTime}::text`,
      exitRoomAt: sql<string>`${visits.exitRoomAt}::text`,
      status: visits.status,
    })
    .from(visits)
    .innerJoin(people, eq(people.id, visits.personId))
    .where(and(eq(visits.status, "reciveMedicine"), eq(visits.siteId, siteId)));
  return data;
};

export const updateVisitToMedicineQuery = async (
  data: DashboardMedicineSchema,
) => {
  await db.transaction(async (tx) => {
    await tx
      .update(visits)
      .set({
        status: "finish",
        reciveMedicineTime: sql`now()`,
      })
      .where(eq(visits.id, data.visitId));

    for (const med of data.medicines) {
      const res = await tx
        .update(medicineCharges)
        .set({
          quantity: sql`${medicineCharges.quantity} - ${med.count}`,
        })
        .where(
          and(
            eq(medicineCharges.id, med.chargeId),
            gte(medicineCharges.quantity, med.count),
          ),
        )
        .returning({ id: medicineCharges.id });

      if (res.length === 0) {
        throw new Error("موجودی دارو کافی نیست");
      }
      await tx
        .update(visitToMedicine)
        .set({
          chargeId: med.chargeId,
          count: med.count,
        })
        .where(
          and(
            eq(visitToMedicine.visitId, data.visitId),
            eq(visitToMedicine.medicineId, med.medicineId),
          ),
        );
    }
  });
};

export const getVisitMedicinesQuery = async (visitId: number) => {
  const data = await db
    .select({
      visitId: visitToMedicine.visitId,
      medicineId: visitToMedicine.medicineId,
      medicineName: medicines.name,
      charges: sql`
      json_agg(
        json_build_object(
          'id', ${medicineCharges.id},
          'expiryDate', ${medicineCharges.expiryDate},
          'quantity', ${medicineCharges.quantity},
          'storageLocation', ${medicineCharges.storageLocation}
        )
      )
    `.as("charges"),
    })
    .from(visitToMedicine)
    .leftJoin(medicines, eq(visitToMedicine.medicineId, medicines.id))
    .leftJoin(medicineCharges, eq(medicineCharges.medicineId, medicines.id))
    .where(eq(visitToMedicine.visitId, visitId))
    .groupBy(
      visitToMedicine.visitId,
      visitToMedicine.medicineId,
      medicines.name,
    );
  return data;
};
