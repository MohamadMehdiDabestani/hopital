"use client";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {loginSchema, LoginSchemaType} from '@/features/auth'

export const useAuthForm = (onSubmit: (values: any) => void) =>
  useFormik<LoginSchemaType>({
    initialValues: { phone: "", password: "" },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit
  });
