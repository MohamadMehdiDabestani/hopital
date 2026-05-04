import { db } from "@/features/core/drizzle/client";
import { users } from "@/features/core/schema/schema.drizzle";
import { eq } from "drizzle-orm";
import {LoginSchemaType} from '@/features/auth/schemas/auth.schema'
import bcrypt from 'bcrypt'
