import { z } from 'zod';

export const createApprovalChainRuleSchema = z.object({
  body: z.object({
    min_discount_pct: z.number().min(0),
    max_discount_pct: z.number().min(0),
    risk_level: z.enum(['low', 'medium', 'high']),
    steps: z.array(
      z.object({
        step_order: z.number().int().min(1),
        approver_role: z.enum(['sales_manager', 'finance_ops'])
      })
    ).optional()
  })
});
