import { z } from 'zod';

export const approvalActionSchema = z.object({
  body: z.object({
    note: z.string().min(1, 'Note is required for approval/rejection/return actions')
  })
});
