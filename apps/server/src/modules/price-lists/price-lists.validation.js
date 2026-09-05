import { z } from 'zod';

export const createPriceListSchema = z.object({
  body: z.object({
    tier: z.enum(['Bronze', 'Silver', 'Gold']).nullable().optional(),
    currency: z.string().default('USD'),
    price_rule: z.string().min(1)
  })
});

export const addPriceListItemSchema = z.object({
  body: z.object({
    product_id: z.string().min(1),
    price: z.number().min(0)
  })
});
