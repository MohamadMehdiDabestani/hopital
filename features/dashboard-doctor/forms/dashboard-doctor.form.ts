import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { dashboardDoctorSchema } from '../schemas/dashboard-doctor.schema';

export const useDashboardDoctorForm = (onSubmit: (values: any) => void) =>
  useFormik({
    initialValues: {},
    validationSchema: toFormikValidationSchema(dashboardDoctorSchema),
    onSubmit,
  });
