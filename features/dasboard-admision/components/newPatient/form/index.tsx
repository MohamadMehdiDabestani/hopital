"use client";
import { useNotificationStore } from "@/features/core";
import {
  createVisitAction,
  useDasboardAdmisionForm,
} from "@/features/dasboard-admision";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import useSWR from "swr";

function getQueueColor(queueCount: number): "success" | "warning" | "error" {
  if (queueCount <= 3) return "success";
  if (queueCount <= 6) return "warning";
  return "error";
}
type DoctorOption = {
  id: number;
  name: string;
  queueCount: number;
};
export const NewPatientForm = () => {
  const { data: selectList = [], isLoading } = useSWR<DoctorOption[]>(
    "/api/dashboard/admision/doctorSelectList",
  );
  const { show } = useNotificationStore();
  const formik = useDasboardAdmisionForm(async (values) => {
    const createVisit = await createVisitAction(values);
    if (!createVisit.ok) {
      show(createVisit.message, "error");
      return;
    }
    formik.resetForm();
  });

  return (
    <Grid container spacing={5} component="form" onSubmit={formik.handleSubmit}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="کد ملی"
          fullWidth
          name="codeMeli"
          value={formik.values.codeMeli}
          onChange={(e) => {
            const onlyDigits = e.target.value.replace(/\D/g, "");
            formik.setFieldValue("codeMeli", onlyDigits);
          }}
          slotProps={{
            htmlInput: {
              maxLength: 10,
              inputMode: "numeric",
              pattern: "[0-9]*",
            },
          }}
          error={Boolean(formik.touched.codeMeli && formik.errors.codeMeli)}
          helperText={formik.touched.codeMeli && formik.errors.codeMeli}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Autocomplete
          fullWidth
          disablePortal
          clearOnEscape
          autoHighlight
          loading={isLoading}
          options={selectList}
          value={
            selectList.find(
              (d) => String(d.id) === String(formik.values.doctorId),
            ) ?? null
          }
          getOptionLabel={(d) => d.name}
          onChange={(_, v) => formik.setFieldValue("doctorId", v?.id ?? "")}
          renderOption={(props, option) => {
            const { key, ...rest } = props;

            const color = getQueueColor(option.queueCount);
            return (
              <Box
                component="li"
                key={key}
                {...rest}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  py: 0.6,
                }}
              >
                <Avatar>{option.name.at(0)}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {option.name}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  color={color}
                  label={`${option.queueCount} نفر در صف`}
                />
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="دکتر"
              helperText={formik.touched.doctorId && formik.errors.doctorId}
              error={Boolean(formik.touched.doctorId && formik.errors.doctorId)}
            />
          )}
        />
      </Grid>
      <Grid
        size={{ xs: 12, sm: 4 }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ width: { xs: "100%", sm: "50%" } }}
        >
          ذخیره
        </Button>
      </Grid>
    </Grid>
  );
};
