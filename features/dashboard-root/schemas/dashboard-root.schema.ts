import { z } from "zod";

export const dashboardRootSchema = z.object({
  siteId : z.number().optional(),
  firstName: z.string("نام را وارد کنید"),
  lastName: z.string("نام خانوادگی را وارد کنید"),
  siteName: z.string("نام مرکز را وارد کنید"),
  phone: z
    .string({ error: "شماره موبایل را وارد کنید" })
    .regex(/^\d{11}$/, "شماره موبایل باید دقیقاً 11 رقم باشد"),
  codeMeli: z
    .string({ error: "کد ملی را وارد کنید" })
    .regex(/^\d{10}$/, "کد ملی باید دقیقاً 10 رقم باشد"),
  suspended: z.boolean(),
});

export type DashboardRootSchema = z.infer<typeof dashboardRootSchema>;
