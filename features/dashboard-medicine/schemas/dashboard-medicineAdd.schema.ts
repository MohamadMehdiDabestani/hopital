import { z } from "zod";
import dayjs from "@/features/core/utils/dayjs";
import { formEnum } from "./medicine.drizzle";
import { persianToEnglishForm } from "../const";
export type MedicineForm = (typeof formEnum.enumValues)[number];
export const medicineAddFormSchema = z.object({
  medicineId: z.number().optional(),
  name: z.string().min(2, "نام دارو حداقل ۲ کاراکتر"),
  form: z.enum(formEnum.enumValues, {
    error: () => ({
      message: "نوع دارو باید یکی از موارد: قرص، شربت، تزریقی، پماد باشد",
    }),
  }),
  isActive: z.boolean().default(true),
});



export type MedicineAddFormValues = z.infer<typeof medicineAddFormSchema>;
