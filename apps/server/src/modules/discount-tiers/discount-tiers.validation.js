import { z } from 'zod';

export const createDiscountTiersSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
