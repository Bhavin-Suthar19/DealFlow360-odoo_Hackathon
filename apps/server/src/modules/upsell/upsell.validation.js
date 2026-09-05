import { z } from 'zod';

export const createUpsellRuleSchema = z.object({
  body: z.object({
    base_product_id: z.string().min(1),
    suggested_product_id: z.string().min(1),
    min_margin_pct: z.number().min(0).default(0),
    is_promoted: z.boolean().default(false)
  })
});
