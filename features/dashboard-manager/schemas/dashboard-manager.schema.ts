import { roleEnum } from "@/features/auth/schemas/users.drizzle";
import { z } from "zod";

const roleValues = [
  "root",
  "manager",
  "doctor",
  "medicine",
  "admision",
] as const;
type Role = (typeof roleValues)[number];

export const dashboardManagerSchema = z.object({
  // TODO: define fields
});
export const dashboardManagerUserAddSchema = z.object({
  rowUserId: z.number().optional(),
  firstName: z.string("نام را وارد کنید"),
  lastName: z.string("نام خانوادگی را وارد کنید"),
  phone: z
    .string({ error: "شماره موبایل را وارد کنید" })
    .regex(/^\d{11}$/, "شماره موبایل باید دقیقاً 11 رقم باشد"),
  codeMeli: z
    .string({ error: "کد ملی را وارد کنید" })
    .regex(/^\d{10}$/, "کد ملی باید دقیقاً 10 رقم باشد"),
  role: z.enum(
    roleEnum.enumValues,
    "نقش باید یکی از موارد: مدیر , دارودار , دکتر , پذیرش باشد",
  ),
  suspended: z.boolean(),
});

export type DashboardManagerSchema = z.infer<typeof dashboardManagerSchema>;
export type DashboardManagerUserAddSchema = z.input<
  typeof dashboardManagerUserAddSchema
>;
