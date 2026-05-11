"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useDashboardMedicineAddForm } from "../../forms/dashboard-medicineAdd.from";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

export const MedicineAddDialog = ({ onClose, onSave, open }: Props) => {
  const formik = useDashboardMedicineAddForm((values) => {});

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>افزودن دارو</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            name="name"
            label="نام دارو"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
          />
          <FormControl
            fullWidth
            error={formik.touched.form && Boolean(formik.errors.form)}
          >
            <InputLabel id="form-label">نقش</InputLabel>
            <Select
              labelId="form-label"
              name="form"
              label="فرم دارو"
              value={formik.values.form}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="pill">قرص</MenuItem>
              <MenuItem value="cyrup">شربت</MenuItem>
              <MenuItem value="oitment">پماد</MenuItem>
              <MenuItem value="injection">تزریقی</MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.form && (formik.errors.form as string)}
            </FormHelperText>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                name="isActive"
                checked={formik.values.isActive}
                onChange={formik.handleChange}
              />
            }
            label="فعال"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} loading={false}>
          انصراف
        </Button>
        <Button type="submit" variant="contained" loading={false}>
          ثبت
        </Button>
      </DialogActions>
    </Dialog>
  );
};
