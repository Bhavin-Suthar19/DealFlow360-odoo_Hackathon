import { z } from 'zod';

export const createQuotationsSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
