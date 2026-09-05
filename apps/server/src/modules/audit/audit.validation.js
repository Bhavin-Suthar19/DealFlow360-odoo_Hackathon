import { z } from 'zod';

export const createAuditSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
