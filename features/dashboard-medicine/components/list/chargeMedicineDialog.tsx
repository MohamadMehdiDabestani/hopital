"use client";

import { useState, useMemo, useEffect } from "react";
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

const JALALI_FMT = "YYYY/MM/DD";
const GREG_FMT = "YYYY-MM-DD";
const parseJalaliDateString = (s: string): Dayjs | null => {
  if (!s || typeof s !== "string") return null;

  // جدا کردن سال، ماه، روز
  const parts = s.split("/");
  if (parts.length !== 3) return null;

  const [jy, jm, jd] = parts.map(Number);

  // اعتبارسنجی اعداد
  if (isNaN(jy) || isNaN(jm) || isNaN(jd)) return null;
  if (jy < 1000 || jy > 9999) return null; // محدوده منطقی سال جلالی
  if (jm < 1 || jm > 12) return null;
  if (jd < 1 || jd > 31) return null;

  try {
    // ساخت Dayjs جلالی
    const d = dayjs()
      .calendar("jalali")
      .year(jy)
      .month(jm - 1) // ماه‌ها در dayjs از صفر شروع می‌شوند
      .date(jd)
      .startOf("day");

    // بررسی اعتبار نهایی (مثلاً 31 بهمن وجود ندارد)
    if (!d.isValid()) return null;

    return d;
  } catch (error) {
    return null;
  }
};
const toJalaliString = (d: Dayjs) => d.calendar("jalali").format(JALALI_FMT);

const fromJalaliStringToJalaliDayjs = (s: string) =>
  dayjs(s, JALALI_FMT, "fa", true).calendar("jalali");
// اگر بالا جواب نداد (بعضی نسخه‌ها):
// const fromJalaliStringToJalaliDayjs = (s: string) =>
//   dayjs(s, { jalali: true, format: JALALI_FMT });

const fromJalaliStringToGregorianDayjs = (s: string) =>
  fromJalaliStringToJalaliDayjs(s).calendar("gregory");
type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  charge?: Charge;
};
export const ChargeMedicineDialog = ({
  onClose,
  onSave,
  open,
  charge,
}: Props) => {
  const [isJalali, setIsJalali] = useState(true);

  const formik = useDashboardMedicineAddForm((values) => {
    // values.expiryDate همین الان جلالی است => مستقیم ارسال کن
    console.log(values);
  });

  const expiryValue = useMemo(() => {
    if (!formik.values.expiryDate) return null;
    const jalaliDay = parseJalaliDateString(formik.values.expiryDate);
    if (!jalaliDay) return null;
    return isJalali ? jalaliDay : jalaliDay.calendar("gregory");
  }, [formik.values.expiryDate, isJalali]);

  const minDate = useMemo(() => {
    const tomorrow = dayjs().add(1, "day").startOf("day");
    return isJalali ? tomorrow.calendar("jalali") : tomorrow;
  }, [isJalali]);
  useEffect(() => {
    if (open && charge)
      formik.setValues({
        expiryAlertDays: charge.expiryAlertDays,
        expiryDate: charge.expiryDate,
        quantity: charge.quantity,
        notes: charge.note,
        storageLocation: charge.storageLocation,
        medicineId: charge.medicineId,
      });
  }, [open, charge]);

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
                const jalali = toJalaliString(dayjs(newValue));
                formik.setFieldValue("expiryDate", jalali);
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
              loading={false}
            >
              ویرایش
            </Button>
          ) : (
            <Button type="submit" variant="contained" loading={false}>
              افزودن
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};
