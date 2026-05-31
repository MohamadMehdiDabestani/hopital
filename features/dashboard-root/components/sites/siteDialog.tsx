"use client";
import { useEffect, useTransition } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { creatOrUpdateSiteAction } from "@/features/dashboard-root/actions";
import { useDashboardRootForm } from "@/features/dashboard-root";
import { useNotificationStore } from "@/features/core";
import { ActionErrorMapping } from "@/features/core/utils/actionErrorMapping";
import { SiteRow } from "./types";
type Props = {
  open: boolean;
  onClose: () => void;
  row?: SiteRow;
  onSvaed : () => void
};

export const SiteDialog = ({ open, onClose, row , onSvaed}: Props) => {
  const [loading, startLoading] = useTransition();
  const { show } = useNotificationStore();

  const formik = useDashboardRootForm((values) => {
    startLoading(async () => {
      try {
        const res = await creatOrUpdateSiteAction(values);

        if (!res.ok) {
          show(res.message, "error");
          return;
        }
        onSvaed();
        onClose();
      } catch (err: any) {
        show(ActionErrorMapping(err), "error");
      }
    });
  });
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };
  useEffect(() => {
    if (open && row) {
      formik.setValues({
        firstName: row.user.firstName ?? "",
        lastName: row.user.lastName ?? "",
        codeMeli: row.user.codeMeli ?? "",
        phone: row.user.phone ?? "",
        suspended: row.user.suspended,
        siteName: row.siteName ?? "",
        siteId : row.id
      });
    } else if (open && !row) {
      formik.resetForm();
    }
  }, [open, row]);
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{row ? "ویرایش کاربر" : "افزودن کاربر"}</DialogTitle>

      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              name="firstName"
              label="نام"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
              fullWidth
            />

            <TextField
              name="lastName"
              label="نام خانوادگی"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              fullWidth
            />
            <TextField
              name="siteName"
              label="نام مرکز"
              value={formik.values.siteName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.siteName && Boolean(formik.errors.siteName)}
              helperText={formik.touched.siteName && formik.errors.siteName}
              fullWidth
            />
            <TextField
              name="codeMeli"
              label="کد ملی"
              value={formik.values.codeMeli}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.codeMeli && Boolean(formik.errors.codeMeli)}
              helperText={formik.touched.codeMeli && formik.errors.codeMeli}
              slotProps={{
                htmlInput: {
                  maxLength: 10,
                },
              }}
              fullWidth
            />

            <TextField
              name="phone"
              label="شماره تماس"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              slotProps={{
                htmlInput: {
                  maxLength: 11,
                },
              }}
              fullWidth
            />

            {row && (
              <FormControlLabel
                control={
                  <Checkbox
                    name="suspended"
                    checked={formik.values.suspended}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                }
                labelPlacement="end"
                label="تعلیق کاربر"
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            انصراف
          </Button>
          {row ? (
            <Button
              type="submit"
              color="warning"
              variant="contained"
              loading={loading}
            >
              ویرایش
            </Button>
          ) : (
            <Button type="submit" variant="contained" loading={loading}>
              افزودن
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
