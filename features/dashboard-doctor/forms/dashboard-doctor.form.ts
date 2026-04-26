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
      drugs: [],
      extraPatientNote: "",
      extraVisitNote: "",
      specialDiseases: "",
      tests: [],
    },
    validationSchema: toFormikValidationSchema(dashboardDoctorPatientSchema),
    onSubmit,
  });
