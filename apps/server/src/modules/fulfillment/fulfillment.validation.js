import { z } from 'zod';

export const createFulfillmentSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
