"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from "@mui/material";
import { useDashboardMedicineAddForm } from "@/features/dashboard-medicine/forms/dashboard-medicineAdd.from";
import { useEffect, useTransition } from "react";
import { addOrUpdateMedicineAction } from "@/features/dashboard-medicine/actions";
import { useNotificationStore } from "@/features/core";
import { Medicine } from "./type";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  medicine?: Medicine;
};

export const MedicineDialog = ({
  onClose,
  onSave,
  open,
  medicine,
}: Props) => {
  const [isLoading, startTransition] = useTransition();
  const { show } = useNotificationStore();
  const formik = useDashboardMedicineAddForm(async (values) => {
    startTransition(async () => {
      const res = await addOrUpdateMedicineAction(values);

      if (res.ok) {
        onSave();
        onClose();
      } else {
        show(res.message, "error");
      }
    });
  });
  useEffect(() => {
    if (open && medicine)
      formik.setValues({
        name: medicine.name,
        form: medicine.form,
        medicineId: medicine.id,
        isActive: medicine.isActive,
      });
  }, [open, medicine]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {medicine ? (
        <DialogTitle>ویرایش دارو</DialogTitle>
      ) : (
        <DialogTitle>افزودن دارو</DialogTitle>
      )}
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              name="name"
              label="نام دارو"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth
            />
            <FormControl
              fullWidth
              error={formik.touched.form && Boolean(formik.errors.form)}
            >
              <InputLabel id="form-label">نقش</InputLabel>
              <Select
                labelId="form-label"
                name="form"
                label="فرم دارو"
                value={formik.values.form}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="pill">قرص</MenuItem>
                <MenuItem value="cyrup">شربت</MenuItem>
                <MenuItem value="oitment">پماد</MenuItem>
                <MenuItem value="injection">تزریقی</MenuItem>
              </Select>
              <FormHelperText>
                {formik.touched.form && (formik.errors.form as string)}
              </FormHelperText>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                />
              }
              label="فعال"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>انصراف</Button>
          {medicine ? (
            <Button
              type="submit"
              color="warning"
              variant="contained"
              loading={isLoading}
            >
              ویرایش
            </Button>
          ) : (
            <Button type="submit" variant="contained" loading={isLoading}>
              افزودن
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
