import { z } from 'zod';

export const authSchema = z.object({
  // TODO: define fields
});

export type AuthSchema = z.infer<typeof authSchema>;
