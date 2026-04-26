import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { dashboardMedicineSchema } from '../schemas/dashboard-medicine.schema';

export const useDashboardMedicineForm = (onSubmit: (values: any) => void) =>
  useFormik({
    initialValues: {},
    validationSchema: toFormikValidationSchema(dashboardMedicineSchema),
    onSubmit,
  });
