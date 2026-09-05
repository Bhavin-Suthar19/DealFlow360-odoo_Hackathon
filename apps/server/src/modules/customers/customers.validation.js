import { z } from 'zod';

export const createCustomersSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
