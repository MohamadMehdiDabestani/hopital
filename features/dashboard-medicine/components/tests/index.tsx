"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

import { useDashboardMedicineAddTestForm } from "../../forms/dashboard-medicineAddTests";
import { addOrUpdateMedicineTestAction } from "../../actions";
import useSWR from "swr";

type TestRow = {
  id: number;
  name: string | null;
  suspended: boolean | null;
};

export const DashboardTestsList = ({
  initialData,
}: {
  initialData: TestRow[];
}) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TestRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const { data, mutate } = useSWR("/api/dashboard/medicine/tests", {
    fallbackData: initialData,
    revalidateOnMount: false, // جلوگیری از ری‌فچ اولیه
    revalidateIfStale: false, // اگر stale بود هم ری‌فچ نکن
    revalidateOnFocus: false, // با فوکوس پنجره ری‌فچ نکن
    revalidateOnReconnect: false,
  });
  const formik = useDashboardMedicineAddTestForm((values) => {
    startTransition(async () => {
      await addOrUpdateMedicineTestAction(values);
      mutate();
      handleClose();
    });
  });

  const handleOpenAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleOpenEdit = (row: TestRow) => {
    setEditing(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };
  useEffect(() => {
    if (editing?.id !== undefined)
      formik.setValues({
        name: editing.name as string,
        suspended: editing.suspended as boolean,
        id: editing.id,
      });
    else formik.resetForm()
  }, [editing]);
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="contained" onClick={handleOpenAdd} sx={{ mb: 2 }}>
        افزودن آزمایش
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>کد</TableCell>
              <TableCell>نام آزمایش</TableCell>
              <TableCell>وضعیت</TableCell>
              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: TestRow) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.suspended ? "غیرفعال" : "فعال"}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpenEdit(row)}>
                    ویرایش
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "ویرایش آزمایش" : "افزودن آزمایش"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="نام آزمایش"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={!!(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  name="suspended"
                  checked={formik.values.suspended}
                  onChange={formik.handleChange}
                />
              }
              label="غیرفعال"
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button onClick={handleClose} sx={{ mr: 2 }}>
                انصراف
              </Button>
              <Button type="submit" variant="contained" disabled={isPending}>
                ذخیره
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
