import { z } from 'zod';

export const createNegotiationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
