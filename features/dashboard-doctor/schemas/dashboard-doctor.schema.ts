import { z } from "zod";
const toNumberOrUndef = (v: unknown) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

const trimToUndef = (v: unknown) => {
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t === "" ? undefined : t;
};

const drugSchema = z
  .object({
    id: z.number().min(1, "id الزامی است"),
    name : z.string(),
    intervalHours: z.preprocess(
      toNumberOrUndef,
      z.number().positive().optional(),
    ),

    daysPerWeek: z.preprocess(
      toNumberOrUndef,
      z.number().min(1).max(7).optional(),
    ),

    note: z.preprocess(trimToUndef, z.string().optional()),
  })
  .superRefine((d, ctx) => {
    const hasAny =
      d.intervalHours !== undefined ||
      d.daysPerWeek !== undefined ||
      d.note !== undefined;

    if (!hasAny) {
      ctx.addIssue({
        code: "custom", 
        message: "باید حداقل یکی از ساعت، روز یا توضیحات وارد شود",
        path: ["intervalHours"],
      });
    }
  });
const dashboardDoctorPatientTestSchema = z.object({
  id: z.number(),
  name : z.string(),
});
export const dashboardDoctorPatientSchema = z.object({
  drugs: z.array(drugSchema).optional(),

  tests: z.array(dashboardDoctorPatientTestSchema).optional(),

  extraNotes: z.string().optional(),
});

export type DashboardDoctorPatientSchema = z.infer<
  typeof dashboardDoctorPatientSchema
>;
export type DashboardDoctorPatientTestSchema = z.infer<typeof dashboardDoctorPatientTestSchema>;
export type DashboardDoctorPatientDrugSchema = z.infer<typeof drugSchema>;
