"use client";
import { useDasboardAdmisionForm } from "@/features/dasboard-admision";
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
import { AutoCompleteG } from "@/features/core";
type Doctor = {
  id: string;
  name: string;
  queueCount: number;
  specialty: string;
};
// Yes , I know it is not good but I can not install Prisma ...
const selectList = [
  {
    id: "1",
    name: "ALI",
    queueCount: 2,

    specialty: "sp",
  },
  {
    id: "2",
    name: "Hassan",
    queueCount: 5,
    specialty: "sp",
  },
  {
    id: "5",
    name: "Reza",
    queueCount: 20,
    specialty: "jjjghfhdks",
  },
];
function getQueueColor(queueCount: number): "success" | "warning" | "error" {
  if (queueCount <= 3) return "success";
  if (queueCount <= 6) return "warning";
  return "error";
}
export const NewPatientForm = () => {
  const formik = useDasboardAdmisionForm((values) => {
    console.log("submited", values);
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
          options={selectList}
          value={
            selectList.find((d) => d.id == formik.values.doctorId.toString()) ??
            null
          }
          getOptionLabel={(d) => d.name}
          groupBy={(d) => d.specialty}
          
          onChange={(_, v) => formik.setFieldValue("doctorId", v?.id)}
          renderOption={(props, option) => {
            const color = getQueueColor(option.queueCount);
            return (
              <Box
                component="li"
                {...props}
                key={option.id}
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
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {option.specialty}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  color={color}
                  label={`${option.queueCount} نفر در صف`}
                  variant="filled"
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
