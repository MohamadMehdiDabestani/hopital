"use client";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  MedicineAddFormValues,
  medicineAddFormSchema,
} from "../schemas/dashboard-medicineAdd.schema";

export const useDashboardMedicineAddForm = (
  onSubmit: (values: any) => void,
) =>
  useFormik<MedicineAddFormValues>({
    initialValues: {
      isActive: true,
      name: "",
      form: "",
    },
    validationSchema: toFormikValidationSchema(medicineAddFormSchema),
    onSubmit,
  });
