import { z } from 'zod';

export const alertActionSchema = z.object({
  body: z.object({
    detail: z.string().optional()
  })
});
