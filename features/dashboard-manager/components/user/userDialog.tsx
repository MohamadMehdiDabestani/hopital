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
import { useDashboardManagerAddForm } from "@/features/dashboard-manager";
type User = {
  id: string;
  firstName: string;
  lastName: string;
  codeMeli: string;
  phone: string;
  lastLoginAt: string; // ISO
  role: string;
  status: "active" | "suspended";
};
type Props = {
  open: boolean;
  onClose: () => void;
  user?: User;
};
const roleToId: Record<User["role"], number> = {
  admin: 1,
  doctor: 2,
  medicine: 3,
  admision: 4,
};
export const UserDialog = ({ open, onClose, user }: Props) => {
  const formik = useDashboardManagerAddForm((values) => {
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
        roleId: roleToId[user.role] ?? "",
        suspended : user.status == "suspended"
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

            <FormControl
              fullWidth
              error={formik.touched.roleId && Boolean(formik.errors.roleId)}
            >
              <InputLabel id="roleId-label">نقش</InputLabel>
              <Select
                labelId="roleId-label"
                name="roleId"
                label="نقش"
                value={formik.values.roleId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value={1}>ادمین</MenuItem>
                <MenuItem value={2}>دکتر</MenuItem>
                <MenuItem value={3}>دارو دار</MenuItem>
                <MenuItem value={4}>پذیرش</MenuItem>
              </Select>
              <FormHelperText>
                {formik.touched.roleId && (formik.errors.roleId as string)}
              </FormHelperText>
            </FormControl>
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
