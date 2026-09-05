import { z } from 'zod';

export const createUsersSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});
