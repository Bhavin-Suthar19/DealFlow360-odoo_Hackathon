import { z } from 'zod';

export const createWarehouseSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    shipping_weight: z.number().min(0).default(1.0)
  })
});

export const updateStockSchema = z.object({
  body: z.object({
    product_id: z.string().min(1),
    qty_in_stock: z.number().int().min(0),
    qty_reserved: z.number().int().min(0).default(0)
  })
});
