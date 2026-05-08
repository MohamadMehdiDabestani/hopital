"use client";

import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  dashboardRootSchema,
  DashboardRootSchema,
} from "../schemas/dashboard-root.schema";

export const useDashboardRootForm = (onSubmit: (values: any) => void) =>
  useFormik<DashboardRootSchema>({
    initialValues: {
      codeMeli: "",
      firstName: "",
      lastName: "",
      phone: "",
      siteName: "",
      suspended: false,
    },
    validationSchema: toFormikValidationSchema(dashboardRootSchema),
    onSubmit,
  });
