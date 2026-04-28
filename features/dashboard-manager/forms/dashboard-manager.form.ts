import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  dashboardManagerUserAddSchema,
  DashboardManagerUserAddSchema,
} from "../schemas/dashboard-manager.schema";

export const useDashboardManagerAddForm = (onSubmit: (values: any) => void) =>
  useFormik<DashboardManagerUserAddSchema>({
    initialValues: {
      codeMeli: "",
      firstName: "",
      lastName: "",
      phone: "",
      roleId: "",
    },
    validationSchema: toFormikValidationSchema(dashboardManagerUserAddSchema),
    onSubmit,
  });
