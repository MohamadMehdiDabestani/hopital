'use client'
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { dasboardAdmisionSchema , DasboardAdmisionSchemaType } from '../schemas/dasboard-admision.schema';

export const useDasboardAdmisionForm = (onSubmit: (values: any) => void) =>
  useFormik<DasboardAdmisionSchemaType>({
    initialValues: {doctorId : 0 , codeMeli : ""},
    validationSchema: toFormikValidationSchema(dasboardAdmisionSchema),
    onSubmit,
  });
