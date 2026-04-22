import { z } from "zod";

export const dasboardAdmisionSchema = z.object({
  codeMeli: z
    .string({ error: "کد ملی الزامی است" })
    .regex(/^\d{10}$/, "کد ملی باید دقیقاً 10 رقم باشد"),
  doctorId: z
    .coerce.number({ error: "یک دکتر معتبر انتخاب کنید" })
    .positive("یک دکتر معتبر انتخاب کنید"),
});

export type DasboardAdmisionSchemaType = z.infer<typeof dasboardAdmisionSchema>;
