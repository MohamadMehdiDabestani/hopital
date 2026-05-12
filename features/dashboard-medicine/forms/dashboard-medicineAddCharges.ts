"use client";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {DashboardMedicineAddCharges , dashboardMedicineAddCharges
} from "../schemas/dashboardMedicineAddCharges.schema";
import dayjs from "@/features/core/utils/dayjs"; 
export const useDashboardMedicineAddForm = (
  onSubmit: (values: any) => void,
) =>
  useFormik<DashboardMedicineAddCharges>({
    initialValues: {
      expiryAlertDays : 0,
      expiryDate : dayjs().format("YYYY-MM-DD"),
      medicineId : 0,
      quantity : 0,
      storageLocation : "",
      notes : ""
    },
    validationSchema: toFormikValidationSchema(dashboardMedicineAddCharges),
    onSubmit,
  });
