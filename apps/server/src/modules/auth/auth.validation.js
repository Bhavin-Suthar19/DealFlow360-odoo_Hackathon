import { z } from 'zod';

export const createAuthSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
