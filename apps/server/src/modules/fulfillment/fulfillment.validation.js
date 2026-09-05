import { z } from 'zod';

export const manualOverrideSchema = z.object({
  body: z.object({
    allocations: z.array(
      z.object({
        warehouse_id: z.string().min(1),
        product_id: z.string().min(1),
        qty_fulfilled: z.number().int().min(1)
      })
    )
  })
});
