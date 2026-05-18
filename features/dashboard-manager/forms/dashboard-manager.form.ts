'use client'
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  dashboardManagerUserAddSchema,
  DashboardManagerUserAddSchema,
} from "../schemas/dashboard-manager.schema";

export const useDashboardManagerAddForm = (onSubmit: (values: any) => void) =>
  useFormik<DashboardManagerUserAddSchema>({
    initialValues: {
      codeMeli: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "manager",
      suspended : false
    },
    validationSchema: toFormikValidationSchema(dashboardManagerUserAddSchema),
    onSubmit,
  });
