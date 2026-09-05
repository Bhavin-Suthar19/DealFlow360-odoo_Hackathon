import { z } from 'zod';

export const recordPaymentSchema = z.object({
  body: z.object({
    amount_paid: z.number().min(0.01).optional(),
    amount: z.number().min(0.01).optional(),
    method: z.string().optional(),
    payment_method: z.string().optional()
  }).refine(data => data.amount_paid !== undefined || data.amount !== undefined, {
    message: 'Either amount_paid or amount is required'
  })
});
