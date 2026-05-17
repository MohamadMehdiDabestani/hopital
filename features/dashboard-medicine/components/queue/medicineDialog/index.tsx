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
  Skeleton,
} from "@mui/material";
import { Fragment, useEffect, useMemo, useState, useTransition } from "react";
import {
  updateVisitMedicinesAction,
  useDashboardMedicineQueueForm,
} from "@/features/dashboard-medicine";
import { getServerTime } from "@/features/core/actions/time";
import dayjs from "@/features/core/utils/dayjs";
import useSWR from "swr";
import { ActionResult, useNotificationStore } from "@/features/core";

type MedicineDialogProps = {
  visitId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type ApiResult = {
  visitId: number;
  medicineId: number;
  medicineName: string;
  charges: {
    id: number;
    expiryDate: string;
    quantity: number;
    storageLocation: string;
  }[];
};
export const MedicineDialog = ({
  visitId,
  open,
  setOpen,
}: MedicineDialogProps) => {
  const [loadingT, startTransition] = useTransition();
  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("visitId", String(visitId));

    return `/api/dashboard/medicine/visitMedicines?${params.toString()}`;
  }, [visitId]);
  const { data, isLoading } = useSWR<ActionResult<ApiResult[]>>(query);
  const { show } = useNotificationStore();
  const formik = useDashboardMedicineQueueForm(async (values) => {
    startTransition(async () => {
      const res = await updateVisitMedicinesAction(values);
      if (res.ok) setOpen(false);
      else show(res.message, "error");
    });
  });
  const [serverNowIso, setServerNowIso] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const time = await getServerTime();
      if (mounted) setServerNowIso(time.gregorianIso);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (!open || !data) return;
    if (data.ok) {
      formik.setFieldValue(
        "medicines",
        data.data.map((m) => ({
          medicineId: m.medicineId,
          chargeId: m.charges[0]?.id ?? 0,
          count: 1,
          quantity: m.charges[0]?.quantity ?? 0,
        })),
      );
      formik.setFieldValue("visitId", visitId);
    }
  }, [data, open]);
  console.log(data);
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogTitle>ثبت تحویل دارو</DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <Divider />

            <Typography variant="subtitle1">اقلام دارویی</Typography>

            {isLoading ? (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Skeleton variant="text" width={140} height={32} />

                <Skeleton
                  variant="rounded"
                  height={56}
                  sx={{ minWidth: 200 }}
                />

                <Skeleton variant="rounded" height={56} width={120} />
              </Stack>
            ) : data?.ok ? (
              data?.data.map((med, i) => {
                const row = formik.values.medicines?.[i] ?? {
                  medicineId: med.medicineId,
                  chargeId: 0,
                  count: 1,
                };
                const chargeTouched = (formik.touched.medicines?.[i] as any)
                  ?.chargeId;
                const chargeError = (formik.errors.medicines?.[i] as any)
                  ?.chargeId;

                const countTouched = (formik.touched.medicines?.[i] as any)
                  ?.count;
                const countError = (formik.errors.medicines?.[i] as any)?.count;

                return (
                  <Fragment key={med.medicineId}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Typography variant="subtitle1">
                        {med.medicineName}
                      </Typography>

                      <TextField
                        select
                        label="شارژ"
                        name={`medicines[${i}].chargeId`}
                        value={row.chargeId}
                        onChange={(e) => {
                          formik.setFieldValue(
                            `medicines[${i}].chargeId`,
                            Number(e.target.value),
                          );
                            formik.setFieldValue(`medicines[${i}].quantity`, row.quantity)
                        }}
                        onBlur={formik.handleBlur}
                        error={Boolean(chargeTouched && chargeError)}
                        helperText={
                          chargeTouched && chargeError
                            ? String(chargeError)
                            : " "
                        }
                      >
                        {med.charges.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.quantity} - exp: {c.expiryDate}
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
              })
            ) : (
              <Typography color="error">
                {data?.message ?? "خطا در دریافت اطلاعات"}
              </Typography>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            تاریخ میلادی :
            {serverNowIso ? dayjs(serverNowIso).format("YYYY/MM/DD") : "…"}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            color="error"
            onClick={() => setOpen(false)}
            disabled={loadingT}
          >
            بستن
          </Button>
          <Button variant="contained" type="submit" loading={loadingT}>
            تحویل دارو
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
