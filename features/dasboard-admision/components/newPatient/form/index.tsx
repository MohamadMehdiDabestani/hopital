"use client";
import { useDasboardAdmisionForm } from "@/features/dasboard-admision";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
const selectList = [
  {
    id: 1,
    doctorName: "نام دکتر 1",
  },
  {
    id: 2,
    doctorName: "نام دکتر 2",
  },
  {
    id: 3,
    doctorName: "نام دکتر 3",
  },
];
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
          helperText={
            formik.touched.codeMeli && formik.errors.codeMeli
              ? formik.errors.codeMeli
              : ""
          }
        />
      </Grid>

      <Grid
        size={{ xs: 12, sm: 4 }}
        component={FormControl}
        error={Boolean(formik.touched.doctorId && formik.errors.doctorId)}
      >
        <InputLabel id="doctor-select-label">پزشک</InputLabel>
        <Select
          labelId="doctor-select-label"
          id="doctor-select"
          name="doctorId"
          label="پزشک"
          value={formik.values.doctorId || ""}
          onChange={(event) => {
            const selectedValue = Number(event.target.value);
            formik.setFieldValue("doctorId", selectedValue);
          }}
        >
          <MenuItem value="">
            <em>انتخاب کنید</em>
          </MenuItem>
          {selectList.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>
              {doctor.doctorName}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.doctorId && formik.errors.doctorId && (
          <FormHelperText>{formik.errors.doctorId}</FormHelperText>
        )}
      </Grid>
      <Grid
        size={{ xs: 12, sm: 4 }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Button variant="contained" color="primary" type="submit" sx={{width : {xs : "100%" , sm : "auto"}}}>
          ذخیره
        </Button>
      </Grid>
    </Grid>
  );
};
