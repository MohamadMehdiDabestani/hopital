"use client";
import { Fragment, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Stack,
  Button,
  Alert,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useField } from "formik";
import { DashboardDoctorPatientMedicineSchema } from "@/features/dashboard-doctor/schemas/dashboard-doctor.schema";
import { MedicineRow } from "./medicineRow";
import { MedicineList } from "@/features/dashboard-doctor/type";
import { DialogList } from "../dialogList";

export const Prescription = (props: MedicineList) => {
  const [field, , helpers] =
    useField<DashboardDoctorPatientMedicineSchema[]>("medicines");
  const selected = field.value ?? [];
  const [open, setOpen] = useState(false);

  const isSelected = (medicineId: number) =>
    selected.some((d: any) => d.id === medicineId);

  const toggleSelect = (medicine: DashboardDoctorPatientMedicineSchema) => {
    if (isSelected(medicine.id)) {
      helpers.setValue(selected.filter((d: any) => d.id !== medicine.id));
    } else {
      helpers.setValue([
        ...selected,
        {
          id: medicine.id,
          intervalHours: undefined,
          daysPerWeek: undefined,
          note: undefined,
          name: medicine.name,
        },
      ]);
    }
  };

  const handleRemove = (id: number) => {
    helpers.setValue(selected.filter((d: any) => d.id !== id));
  };

  return (
    <Fragment>
      <DialogList
        setOpen={setOpen}
        toggle={toggleSelect}
        list={props.list}
        open={open}
        selected={field.value ?? []}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">داروها</Typography>
        <Button color="info" variant="outlined" onClick={() => setOpen(true)}>
          نمایش دارو ها
        </Button>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Stack sx={{ mt: 2 }}>
        <Box sx={{ maxHeight: 344, overflowY: "auto" }}>
          {selected.length === 0 ? (
            <Alert color="warning" icon={<WarningIcon />}>
              هنوز دارویی انتخاب نشده است.
            </Alert>
          ) : (
            selected.map((p, idx: number) => (
              <MedicineRow
                key={p.id}
                index={idx}
                medicineName={p.name}
                onRemove={() => handleRemove(p.id)}
              />
            ))
          )}
        </Box>
      </Stack>
    </Fragment>
  );
};
