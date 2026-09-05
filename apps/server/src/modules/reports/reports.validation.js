import { z } from 'zod';

export const createReportsSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
