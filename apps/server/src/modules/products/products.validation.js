import { z } from 'zod';

export const createProductSchema = z.object({
  body: z
    .object({
      name: z.string().min(1),
      category_id: z.string().min(1),
      unit: z.string().default('unit'),
      tax_pct: z.number().min(0).default(0),
      base_price: z.number().min(0).default(0),
      stock_on_hand: z.number().optional(),
      description: z.string().optional(),
      is_subscription: z.boolean().default(false),
      recurring_cycle: z.enum(['monthly', 'quarterly', 'yearly']).nullable().optional()
    })
    .refine(
      (data) => {
        if (!data.is_subscription && data.recurring_cycle !== null && data.recurring_cycle !== undefined) {
          return false;
        }
        return true;
      },
      {
        message: 'recurring_cycle must be null unless is_subscription is true',
        path: ['recurring_cycle']
      }
    )
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    category_id: z.string().optional(),
    unit: z.string().optional(),
    tax_pct: z.number().min(0).optional(),
    base_price: z.number().min(0).optional(),
    stock_on_hand: z.number().optional(),
    description: z.string().optional(),
    is_subscription: z.boolean().optional(),
    recurring_cycle: z.enum(['monthly', 'quarterly', 'yearly']).nullable().optional()
  })
});

export const createVariantSchema = z.object({
  body: z.object({
    attribute_name: z.string().min(1),
    attribute_value: z.string().min(1),
    extra_price: z.number().default(0)
  })
});
