"use client";
import { useMemo, useState } from "react";
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
import { DashboardDoctorPatientDrugSchema } from "@/features/dashboard-doctor/schemas/dashboard-doctor.schema";
import { DrugRow } from "./drugRow";
import { DRUGS } from "@/features/dashboard-doctor";
import { DialogList } from "../dialogList";

export const PrescriptionSection = () => {
  const [field, , helpers] =
    useField<DashboardDoctorPatientDrugSchema[]>("drugs");
  const selected = field.value ?? [];
  const [open, setOpen] = useState(false);

  const isSelected = (drugId: number) =>
    selected.some((d: any) => d.id === drugId);

  const toggleSelect = (drug : DashboardDoctorPatientDrugSchema) => {
    if (isSelected(drug.id)) {
      helpers.setValue(selected.filter((d: any) => d.id !== drug.id));
    } else {
      helpers.setValue([
        ...selected,
        {
          id: drug.id,
          intervalHours: undefined,
          daysPerWeek: undefined,
          note: undefined,
          name: drug.name,
        },
      ]);
    }
  };

  const handleRemove = (id: number) => {
    helpers.setValue(selected.filter((d: any) => d.id !== id));
  };

  return (
    <Card>
      <DialogList
        setOpen={setOpen}
        toggle={toggleSelect}
        list={DRUGS}
        open={open}
        selected={field.value ?? []}
      />

      <CardContent>
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
          <Box sx={{ maxHeight: 360, overflowY: "auto" }}>
            {selected.length === 0 ? (
              <Alert color="warning" icon={<WarningIcon />}>
                هنوز دارویی انتخاب نشده است.
              </Alert>
            ) : (
              selected.map((p, idx: number) => {
                return (
                  <DrugRow
                    key={p.id}
                    index={idx}
                    drugName={p.name}
                    onRemove={() => handleRemove(p.id)}
                  />
                );
              })
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
