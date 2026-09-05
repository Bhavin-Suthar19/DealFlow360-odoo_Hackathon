import { z } from 'zod';

export const createWarehousesSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
