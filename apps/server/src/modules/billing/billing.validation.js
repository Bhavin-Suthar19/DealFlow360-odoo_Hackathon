import { z } from 'zod';

export const createBillingSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
