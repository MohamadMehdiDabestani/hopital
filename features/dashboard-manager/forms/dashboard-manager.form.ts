import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { dashboardManagerSchema } from '../schemas/dashboard-manager.schema';

export const useDashboardManagerForm = (onSubmit: (values: any) => void) =>
  useFormik({
    initialValues: {},
    validationSchema: toFormikValidationSchema(dashboardManagerSchema),
    onSubmit,
  });
