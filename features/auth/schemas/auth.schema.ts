import { z } from 'zod';
export const loginSchema = z.object({
  phone: z.string({error : "شماره موبایل الزامی است"}).regex(/^\d{11}$/, "شماره همراه باید دقیقاً 11 رقم باشد"),
  password: z.string({error : "رمز عبور الزامی است"}).min(8, "رمز عبور باید حداقل 8 کاراکتر باشد"),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;
