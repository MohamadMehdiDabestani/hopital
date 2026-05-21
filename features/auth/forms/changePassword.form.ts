"use client";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { changePasswordSchema, ChangePasswordInput } from "@/features/auth";

export const useChangePasswordForm = (onSubmit: (values: any) => void) =>
  useFormik<ChangePasswordInput>({
    initialValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
    validationSchema: toFormikValidationSchema(changePasswordSchema),
    onSubmit,
  });
