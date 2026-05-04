import { db } from "@/features/core/drizzle/client";
import { users } from "@/features/core/schema";
import { eq } from "drizzle-orm";
import {LoginSchemaType} from '@/features/auth/schemas/auth.schema'
import bcrypt from 'bcrypt'
export const loginUser = async (user : LoginSchemaType) => {
  
  return await db.select().from(users).where(eq(users.phoneNumber , user.phone))
};
export const addUser = async (user : LoginSchemaType) => {
  const hashedPassword = await bcrypt.hashSync(user.password , 12)
  return await db.insert(users).values({
    codeMeli : "4480172564",
    firstName : "Mohammad",
    hashedPassword : hashedPassword,
    lastName : "Dabestani",
    phoneNumber : user.phone,
    rule : "admision",
  })
}