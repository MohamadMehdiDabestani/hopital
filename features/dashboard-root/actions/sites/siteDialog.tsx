"use client";
import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useDashboardRootForm } from "@/features/dashboard-root";
type User = {
  id: string;
  firstName: string;
  lastName: string;
  codeMeli: string;
  phone: string;
  lastLoginAt: string; // ISO
  siteName: string;
  status: "active" | "suspended";
};
type Props = {
  open: boolean;
  onClose: () => void;
  user?: User;
};

export const SiteDialog = ({ open, onClose, user }: Props) => {
  const formik = useDashboardRootForm((values) => {
    console.log("submit:", values);
    // call add api
    onClose();
  });
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };
  useEffect(() => {
    if (open && user) {
      formik.setValues({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        codeMeli: user.codeMeli ?? "",
        phone: user.phone ?? "",
        suspended: false,
        siteName: user.siteName ?? "",
      });
    } else if (open && !user) {
      formik.resetForm();
    }
  }, [open, user]);
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{user ? "ویرایش کاربر" : "افزودن کاربر"}</DialogTitle>

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
              name="lastName"
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

            {user && (
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
          <Button onClick={onClose} color="inherit">
            انصراف
          </Button>
          {user ? (
            <Button type="submit" color="warning" variant="contained">
              ویرایش
            </Button>
          ) : (
            <Button type="submit" variant="contained">
              افزودن
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
