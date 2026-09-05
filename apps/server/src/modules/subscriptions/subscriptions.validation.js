import { z } from 'zod';

export const createSubscriptionsSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
