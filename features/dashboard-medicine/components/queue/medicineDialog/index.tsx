"use client";

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  TextField,
  Box,
  Button,
  MenuItem,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { Fragment, useEffect, useMemo } from "react";
import { useDashboardMedicineForm } from "@/features/dashboard-medicine";

type VisitData = {
  visitId: number;
  medicines: {
    medicineId: number;
    name: string;
    intervalHours?: number;
    daysPerWeek?: number;
    note?: string;
    charges: {
      chargeId: number;
      count: number;
      expireDate: string;
    }[];
  }[];
};

type MedicineDialogProps = {
  visitId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const initialVisitData: VisitData[] = [{
  visitId: 1,
  medicines: [
    {
      medicineId: 1,
      charges: [
        { chargeId: 3, count: 1000, expireDate: "2026/05/24" },
      ],
      name: "ویتامین C",
      intervalHours: 8,
    },
    {
      medicineId: 2,
      charges: [{ chargeId: 7, count: 5, expireDate: "2026/06/10" }],
      name: "آموکسی‌سیلین",
      daysPerWeek: 3,
    },
  ],
} , {
    visitId: 2,
  medicines: [
    {
      medicineId: 1,
      charges: [
        { chargeId: 2, count: 20, expireDate: "2026/07/24" },
        { chargeId: 3, count: 10, expireDate: "2026/05/24" },
      ],
      name: "آمپول",
      intervalHours: 8,
    },
    {
      medicineId: 2,
      charges: [{ chargeId: 7, count: 5, expireDate: "2026/06/10" }],
      name: "ضد سرطان",
      daysPerWeek: 3,
    },
  ],
}];

export const MedicineDialog = ({
  visitId,
  open,
  setOpen,
}: MedicineDialogProps) => {
  const visitData: VisitData = useMemo(() => {
    // TODO: API call

    console.log("CALL");
    return initialVisitData.find(v => v.visitId == visitId) as VisitData;
  }, [visitId]);

  const formik = useDashboardMedicineForm((values) => {
    console.log("submit payload:", values);
    setOpen(false);
  });

  // sync اولیه ردیف‌ها با دیتای ویزیت (وقتی دیالوگ باز میشه)
  useEffect(() => {
    if (!open || !visitData) return;
    formik.setFieldValue(
      "medicines",
      visitData.medicines.map((m) => ({
        medicineId: m.medicineId,
        chargeId: m.charges[0].chargeId,
        count: 0,
      })),
    );
  }, [visitData , open , formik.setFieldValue]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>آیتم مورد نظر را انتخاب کنید</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Divider />

          <Typography variant="subtitle1">اقلام دارویی</Typography>

          {visitData?.medicines?.map((med, i) => {
            const row = formik.values.medicines?.[i] ?? {
              medicineId: med.medicineId,
              chargeId: 0,
              count: 0,
            };

            const chargeTouched = (formik.touched.medicines?.[i] as any)
              ?.chargeId;
            const chargeError = (formik.errors.medicines?.[i] as any)?.chargeId;

            const countTouched = (formik.touched.medicines?.[i] as any)?.count;
            const countError = (formik.errors.medicines?.[i] as any)?.count;

            return (
              <Fragment key={med.medicineId}>
                <Typography variant="subtitle1">{med.name}</Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    select
                    label="شارژ"
                    name={`medicines[${i}].chargeId`}
                    value={row.chargeId}
                    onChange={(e) => {
                      const chargeId = Number(e.target.value);
                      formik.setFieldValue(
                        `medicines[${i}].chargeId`,
                        chargeId,
                      );
                    }}
                    onBlur={formik.handleBlur}
                    error={Boolean(chargeTouched && chargeError)}
                    helperText={
                      chargeTouched && chargeError ? String(chargeError) : " "
                    }
                  >
                    {med.charges.map((c) => (
                      <MenuItem key={c.chargeId} value={c.chargeId}>
                        {c.count} - exp: {c.expireDate}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    type="number"
                    label="تعداد"
                    name={`medicines[${i}].count`}
                    value={row.count}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(countTouched && countError)}
                    helperText={
                      countTouched && countError ? String(countError) : " "
                    }
                    slotProps={{ htmlInput: { min: 1 } }}
                  />
                </Stack>
              </Fragment>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>بستن</Button>
        <Button variant="contained" type="submit">
          ثبت
        </Button>
      </DialogActions>
    </Dialog>
  );
};
