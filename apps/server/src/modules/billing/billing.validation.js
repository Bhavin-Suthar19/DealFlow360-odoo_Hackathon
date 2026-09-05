import { z } from 'zod';

export const recordPaymentSchema = z.object({
  body: z.object({
    amount_paid: z.number().min(0.01),
    method: z.string().default('bank_transfer')
  })
});
