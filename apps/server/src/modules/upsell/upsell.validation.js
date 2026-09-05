import { z } from 'zod';

export const createUpsellSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
