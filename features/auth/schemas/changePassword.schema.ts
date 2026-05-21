import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string("رمز عبور فعلی الزامی است")
      .min(8, "رمز عبور فعلی باید بیش از 8 حرف باشد"),
    newPassword: z
      .string("رمز عبور جدید الزامی است")
      .min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد")
      .regex(/[A-Z]/, "باید حداقل یک حرف بزرگ داشته باشد")
      .regex(/[a-z]/, "باید حداقل یک حرف کوچک داشته باشد")
      .regex(/[0-9]/, "باید حداقل یک عدد داشته باشد"),
    confirmPassword: z
      .string("تکرار رمز عبور الزامی است")
      .min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور جدید و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
