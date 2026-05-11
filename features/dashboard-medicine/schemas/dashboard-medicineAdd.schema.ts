import { z } from "zod";

export const medicineAddFormSchema = z.object({
  name: z.string().min(2, "نام دارو حداقل ۲ کاراکتر"),
  form: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type MedicineAddFormValues = z.infer<typeof medicineAddFormSchema>;