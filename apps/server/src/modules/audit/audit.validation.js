import { z } from 'zod';

export const auditQuerySchema = z.object({
  query: z.object({
    entityType: z.string().optional(),
    entityId: z.string().optional(),
    userId: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});
