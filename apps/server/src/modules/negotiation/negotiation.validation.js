import { z } from 'zod';

export const createNegotiationSchema = z.object({
  body: z.object({
    line_id: z.string().nullable().optional(),
    comment: z.string().min(1),
    counter_discount_pct: z.number().min(0).max(100).optional(),
    requested_delivery_date: z.string().nullable().optional(),
    proposed_total: z.number().optional(),
    line_discounts: z.record(z.any()).optional()
  })
});
