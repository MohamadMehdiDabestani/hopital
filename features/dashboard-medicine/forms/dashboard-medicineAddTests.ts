"use client";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  DashboardMedicineTestSchema,
  dashboardMedicineTestSchema,
} from "../schemas/dashboard-medicineTests.schema";

export const useDashboardMedicineAddTestForm = (onSubmit: (values: any) => void) =>
  useFormik<DashboardMedicineTestSchema>({
    initialValues: {
      name: "",
      suspended: false,
      id: undefined,
    },
    validationSchema: toFormikValidationSchema(dashboardMedicineTestSchema),
    onSubmit,
  });
