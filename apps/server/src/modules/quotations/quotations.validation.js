import { z } from 'zod';

export const createQuotationSchema = z.object({
  body: z.object({
    customer_id: z.string().min(1)
  })
});

export const addQuotationLineSchema = z.object({
  body: z.object({
    product_id: z.string().min(1),
    qty: z.number().int().min(1).default(1),
    unit_price: z.number().min(0),
    discount_pct: z.number().min(0).max(100).default(0),
    line_type: z.enum(['one_time', 'recurring']).default('one_time'),
    is_upsell: z.boolean().default(false)
  })
});

export const updateQuotationLineSchema = z.object({
  body: z.object({
    qty: z.number().int().min(1).optional(),
    unit_price: z.number().min(0).optional(),
    discount_pct: z.number().min(0).max(100).optional(),
    line_type: z.enum(['one_time', 'recurring']).optional(),
    is_upsell: z.boolean().optional()
  })
});
