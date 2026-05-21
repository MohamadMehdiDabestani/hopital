// app/components/ChangePasswordDialog.tsx
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useChangePasswordForm } from "@/features/auth/forms/changePassword.form";
import { useState } from "react";
import { useNotificationStore } from "@/features/core";
import { changePasswordAction } from "../../actions";
import { useRouter } from "next/navigation";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ChangePasswordDialog = ({
  open,
  onClose,
}: ChangePasswordDialogProps) => {
  const router = useRouter();
  const { show } = useNotificationStore();
  const formik = useChangePasswordForm(async (values) => {
    try {
      const res = await changePasswordAction(values);
      if (!res.ok) show(res.message, "error");
      else {
        show("رمز عبور تغییر یافت. مجدد وارد شوید", "success");
        router.push("/");
      }
    } catch (error) {
      show("مشکلی پیش آمده", "error");
    }
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>تغییر رمز عبور</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="currentPassword"
            label="رمز عبور فعلی"
            type="password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.currentPassword &&
              Boolean(formik.errors.currentPassword)
            }
            helperText={
              formik.touched.currentPassword && formik.errors.currentPassword
            }
          />

          <TextField
            fullWidth
            margin="normal"
            name="newPassword"
            label="رمز عبور جدید"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />

          <TextField
            fullWidth
            margin="normal"
            name="confirmPassword"
            label="تکرار رمز عبور جدید"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={formik.isSubmitting}>
            انصراف
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
          >
            تغییر رمز
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
