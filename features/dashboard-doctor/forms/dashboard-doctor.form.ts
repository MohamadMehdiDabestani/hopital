'use client'
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  dashboardDoctorPatientSchema,
  DashboardDoctorPatientSchema,
} from "../schemas/dashboard-doctor.schema";

export const useDashboardDoctorForm = (onSubmit: (values: any) => void) =>
  useFormik<DashboardDoctorPatientSchema>({
    initialValues: {
      medicines: [],
      visitId : 0,
      extraNotes: "",
      tests: [],
    },
    validationSchema: toFormikValidationSchema(dashboardDoctorPatientSchema),
    onSubmit,
  });
