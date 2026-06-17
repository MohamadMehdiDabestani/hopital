"use client";
import { useEffect, useTransition } from "react";
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
import {
  createOrUpdateUserForSite,
  useDashboardManagerAddForm,
} from "@/features/dashboard-manager";
import { UserRow } from "../../type";
import { useNotificationStore } from "@/features/core";

type Props = {
  open: boolean;
  onClose: () => void;
  row?: UserRow;
  onSaved: () => void;
};

export const UserDialog = ({ open, onClose, row, onSaved }: Props) => {
  const [loading, startLoading] = useTransition();
  const { show } = useNotificationStore();

  const formik = useDashboardManagerAddForm((values) => {
    startLoading(async () => {
      try {
        const data = await createOrUpdateUserForSite(values);
        if (!data.ok) {
          show(data.message, "error");
          return;
        }
        onSaved();
      } catch (error) {
      } finally {
        onClose();
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
        firstName: row.firstName ?? "",
        lastName: row.lastName ?? "",
        codeMeli: row.codeMeli ?? "",
        phone: row.phone ?? "",
        role: (row.role as any) ?? "",
        suspended: row.suspended,
        rowUserId: row.id,
      });
    } else if (open && !row) {
      formik.resetForm();
    }
  }, [open, row]);
  return (
    <Dialog
      data-testid="userDialog"
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
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
              slotProps={{
                htmlInput: {
                  "data-testid": "firstName",
                },
              }}
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
              slotProps={{
                htmlInput: {
                  "data-testid": "lastName",
                },
              }}
            />

            <TextField
              name="codeMeli"
              label="کد ملی"
              value={formik.values.codeMeli}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.codeMeli && Boolean(formik.errors.codeMeli)}
              helperText={formik.touched.codeMeli && formik.errors.codeMeli}
              fullWidth
              slotProps={{
                htmlInput: {
                  maxLength: 10,
                  "data-testid": "codeMeli",
                },
              }}
            />

            <TextField
              name="phone"
              label="شماره تماس"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              fullWidth
              slotProps={{
                htmlInput: {
                  maxLength: 11,
                  "data-testid": "phone",
                },
              }}
            />

            <FormControl
              fullWidth
              error={formik.touched.role && Boolean(formik.errors.role)}
            >
              <InputLabel id="role-label">نقش</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                label="نقش"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                data-testid="role"
              >
                <MenuItem value="manager">مدیر</MenuItem>
                <MenuItem value="doctor">دکتر</MenuItem>
                <MenuItem value="medicine">دارو دار</MenuItem>
                <MenuItem value="admision">پذیرش</MenuItem>
              </Select>
              <FormHelperText>
                {formik.touched.role && (formik.errors.role as string)}
              </FormHelperText>
            </FormControl>
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
          <Button onClick={onClose} color="inherit" data-testid="closeDialogButton">
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
            <Button type="submit" variant="contained" loading={loading} data-testid="saveUserButton">
              افزودن
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
