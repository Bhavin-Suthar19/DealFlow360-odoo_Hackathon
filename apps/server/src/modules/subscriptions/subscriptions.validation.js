import { z } from 'zod';

export const createSubscriptionPlanSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    cycle: z.enum(['monthly', 'quarterly', 'yearly']),
    proration_rule: z.string().optional(),
    cancellation_rule: z.string().optional()
  })
});

export const createSubscriptionSchema = z.object({
  body: z.object({
    customer_id: z.string().min(1),
    plan_id: z.string().min(1),
    quotation_id: z.string().min(1),
    amount: z.number().min(0)
  })
});

export const cancelSubscriptionSchema = z.object({
  body: z.object({
    reason: z.string().optional()
  })
});
