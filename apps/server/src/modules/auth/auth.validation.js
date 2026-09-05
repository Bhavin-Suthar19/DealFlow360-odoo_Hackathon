import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

export const portalLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().optional(),
    magic_token: z.string().optional()
  })
});
