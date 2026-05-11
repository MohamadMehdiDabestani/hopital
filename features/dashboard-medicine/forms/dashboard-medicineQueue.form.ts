"use client";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  dashboardMedicineSchema,
  DashboardMedicineSchema,
} from "../schemas/dashboard-medicine.schema";

export const useDashboardMedicineQueueForm = (
  onSubmit: (values: any) => void,
) =>
  useFormik<DashboardMedicineSchema>({
    initialValues: {
      visitId: 0,
      medicines: [
        {
          chargeId: 0,
          count: 0,
          medicineId: 0,
        },
      ],
    },
    validationSchema: toFormikValidationSchema(dashboardMedicineSchema),
    onSubmit,
  });
