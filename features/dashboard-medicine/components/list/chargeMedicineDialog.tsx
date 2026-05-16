"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import {
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "@/features/core/utils/dayjs";
import type { Dayjs } from "dayjs";
import { useDashboardMedicineAddForm } from "../../forms/dashboard-medicineAddCharges";
import { Charge } from "./type";
import { addOrUpdateMedicineChargeAction } from "../../actions";
import { useNotificationStore } from "@/features/core";
const JALALI_FMT = "YYYY/MM/DD";
const GREG_FMT = "YYYY-MM-DD";

const toGregorianString = (d: Dayjs) => d.calendar("gregory").format(GREG_FMT);

// مقدار ذخیره‌شده میلادی است:
const fromGregorianStringToGregorianDayjs = (s: string) =>
  dayjs(s, GREG_FMT, "en", true).calendar("gregory");

const fromGregorianStringToJalaliDayjs = (s: string) =>
  fromGregorianStringToGregorianDayjs(s).calendar("jalali");

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  charge?: Charge;
  medicineId: number | undefined;
};
export const ChargeMedicineDialog = ({
  onClose,
  onSave,
  open,
  charge,
  medicineId,
}: Props) => {
  const [isLoading, startTransition] = useTransition();
  const [isJalali, setIsJalali] = useState(true);
  const { show } = useNotificationStore();
  const formik = useDashboardMedicineAddForm(async (values) => {
    startTransition(async () => {
      const res = await addOrUpdateMedicineChargeAction(values);
      if (res.ok) {
        onSave();
        onClose();
        return;
      }
      show(res.message, "error");
    });
  });
  const expiryValue = useMemo(() => {
    if (!formik.values.expiryDate) return null;
    return isJalali
      ? fromGregorianStringToJalaliDayjs(formik.values.expiryDate)
      : fromGregorianStringToGregorianDayjs(formik.values.expiryDate);
  }, [formik.values.expiryDate, isJalali]);
  const minDate = useMemo(() => {
    const tomorrow = dayjs().add(1, "day").startOf("day").calendar("gregory");
    return isJalali ? tomorrow.calendar("jalali") : tomorrow;
  }, [isJalali]);

  useEffect(() => {
    console.log("CHARGE" , charge)
    if (!medicineId || !open) return;
    if (charge)
      formik.setValues({
        expiryAlertDays: charge.expiryAlertDays,
        expiryDate: charge.expiryDate,
        quantity: charge.quantity,
        notes: charge.note,
        storageLocation: charge.storageLocation,
        medicineId: medicineId,
        chargeId: charge.id,
      });
    else formik.setFieldValue("medicineId", medicineId);
  }, [open, charge, medicineId]);
  console.log(formik.errors);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {charge ? (
        <DialogTitle>ویرایش شارژ</DialogTitle>
      ) : (
        <DialogTitle>افزودن شارژ</DialogTitle>
      )}
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="تعداد"
              name="quantity"
              type="number"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isJalali}
                  onChange={(e) => setIsJalali(e.target.checked)}
                />
              }
              label={isJalali ? "تقویم جلالی" : "تقویم میلادی"}
            />
            <DatePicker
              label="تاریخ انقضا"
              value={expiryValue}
              format={isJalali ? JALALI_FMT : GREG_FMT}
              minDate={minDate}
              onChange={(newValue) => {
                if (!newValue) {
                  formik.setFieldValue("expiryDate", "");
                  return;
                }
                const greg = newValue.calendar("gregory").format(GREG_FMT);
                formik.setFieldValue("expiryDate", greg);
              }}
              slotProps={{
                textField: {
                  error: !!formik.errors.expiryDate,
                  helperText: formik.errors.expiryDate,
                  variant: "filled",
                },
              }}
            />

            <TextField
              label="محل ذخیره‌سازی"
              name="storageLocation"
              value={formik.values.storageLocation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.storageLocation &&
                Boolean(formik.errors.storageLocation)
              }
              helperText={
                formik.touched.storageLocation && formik.errors.storageLocation
              }
            />

            <TextField
              label="روزهای هشدار انقضا"
              name="expiryAlertDays"
              type="number"
              value={formik.values.expiryAlertDays}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.expiryAlertDays &&
                Boolean(formik.errors.expiryAlertDays)
              }
              helperText={
                formik.touched.expiryAlertDays && formik.errors.expiryAlertDays
              }
            />

            <TextField
              label="یادداشت"
              name="notes"
              multiline
              rows={3}
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.notes && Boolean(formik.errors.notes)}
              helperText={formik.touched.notes && formik.errors.notes}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>انصراف</Button>
          {charge ? (
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
      </form>
    </Dialog>
  );
};
