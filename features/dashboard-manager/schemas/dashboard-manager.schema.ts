import { z } from "zod";

export const dashboardManagerSchema = z.object({
  // TODO: define fields
});
export const dashboardManagerUserAddSchema = z.object({
  firstName: z.string("نام را وارد کنید"),
  lastName: z.string("نام خانوادگی را وارد کنید"),
  phone: z
    .string({ error: "شماره موبایل را وارد کنید" })
    .regex(/^\d{11}$/, "شماره موبایل باید دقیقاً 11 رقم باشد"),
  codeMeli: z
    .string({ error: "کد ملی را وارد کنید" })
    .regex(/^\d{10}$/, "کد ملی باید دقیقاً 10 رقم باشد"),
  roleId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number({ error: "نقش را انتخاب کنید" })
      .int()
      .positive("نقش را انتخاب کنید")
  ),
});

export type DashboardManagerSchema = z.infer<typeof dashboardManagerSchema>;
export type DashboardManagerUserAddSchema = z.input<
  typeof dashboardManagerUserAddSchema
>;
