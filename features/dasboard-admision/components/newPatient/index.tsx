import { Grid, Paper } from "@mui/material";
import { NewPatientForm } from "./form";

export const NewPatient = () => {
  return (
    <Paper sx={{ p: 2}}>
      <NewPatientForm />
    </Paper>
  );
};
