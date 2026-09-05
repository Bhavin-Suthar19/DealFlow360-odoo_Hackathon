import { z } from 'zod';

export const createApprovalsSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
