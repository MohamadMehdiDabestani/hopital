import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { authSchema } from '../schemas/auth.schema';

export const useAuthForm = (onSubmit: (values: any) => void) =>
  useFormik({
    initialValues: {},
    validationSchema: toFormikValidationSchema(authSchema),
    onSubmit,
  });
