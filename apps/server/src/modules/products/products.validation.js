import { z } from 'zod';

export const createProductsSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
