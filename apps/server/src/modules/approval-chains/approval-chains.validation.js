import { z } from 'zod';

export const createApprovalChainsSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
