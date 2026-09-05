import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string({ required_error: 'MONGO_URI is required' }),
  REDIS_URL: z.string({ required_error: 'REDIS_URL is required' }),
  JWT_SECRET: z.string({ required_error: 'JWT_SECRET is required' }),
  PORTAL_JWT_SECRET: z.string({ required_error: 'PORTAL_JWT_SECRET is required' }),
  LOG_LEVEL: z.string().default('info'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Environment variable validation failed');
}

export const env = _env.data;
export default env;
