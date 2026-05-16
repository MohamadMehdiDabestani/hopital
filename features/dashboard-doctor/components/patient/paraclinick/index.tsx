import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

import { DashboardDoctorPatientTestSchema } from "@/features/dashboard-doctor/schemas/dashboard-doctor.schema";
import { useField } from "formik";
import { DialogList } from "../dialogList";
import { TestList } from "@/features/dashboard-doctor/type";
export const Paraclinic = (props: TestList) => {
  const [field, , helpers] =
    useField<DashboardDoctorPatientTestSchema[]>("tests");
  const selected = field.value ?? [];

  const [open, setOpen] = useState(false);
  const isSelected = (drugId: number) =>
    selected.some((d: any) => d.id === drugId);

  const toggleSelect = (item: DashboardDoctorPatientTestSchema) => {
    if (isSelected(item.id)) {
      helpers.setValue(selected.filter((d: any) => d.id !== item.id));
    } else {
      helpers.setValue([
        ...selected,
        {
          id: item.id,
          name: item.name,
        },
      ]);
    }
  };
  return (
    <Card>
      <DialogList
        list={props.list}
        toggle={toggleSelect}
        open={open}
        setOpen={setOpen}
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
          <Typography variant="h6">آزمایشات</Typography>
          <Button color="info" variant="outlined" onClick={() => setOpen(true)}>
            نمایش آزمایشات
          </Button>
        </Box>
        <Divider sx={{ my: 1 }} />

        {/* تنظیمات هر دارو */}
        <Box sx={{ mt: 2 }}>
          {selected.length === 0 ? (
            <Alert color="warning" icon={<WarningIcon />}>
              هنوز آزمایشی انتخاب نشده است.
            </Alert>
          ) : (
            selected.map((p) => (
              <Chip
                sx={{ mx: 1 }}
                key={p.id}
                label={p.name}
                onDelete={() => toggleSelect(p)}
              />
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
