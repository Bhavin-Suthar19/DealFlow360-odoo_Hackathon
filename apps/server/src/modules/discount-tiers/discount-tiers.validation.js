import { z } from 'zod';

export const createDiscountTierSchema = z.object({
  body: z.object({
    tier_name: z.string().min(1),
    max_discount_pct: z.number().min(0).max(100)
  })
});

export const createCategoryCeilingSchema = z.object({
  body: z.object({
    category_id: z.string().min(1),
    max_discount_pct: z.number().min(0).max(100)
  })
});
