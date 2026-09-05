import { z } from 'zod';

export const reportQuerySchema = z.object({
  query: z.object({
    period: z.string().optional(),
    salesRepId: z.string().optional(),
    approvalStatus: z.string().optional(),
    productId: z.string().optional(),
    category: z.string().optional(),
    format: z.enum(['pdf', 'xlsx', 'csv']).optional()
  })
});
