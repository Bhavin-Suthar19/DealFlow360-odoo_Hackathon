import { z } from 'zod';

export const createDashboardSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
