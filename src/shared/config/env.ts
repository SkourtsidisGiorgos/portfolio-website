import { z } from 'zod';

/**
 * Environment variable schema for type-safe configuration.
 * Uses Zod for runtime validation.
 */
const envSchema = z.object({
  // Resend Email Service
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL: z.string().email().optional(),

  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

/**
 * Type for validated environment variables.
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Get validated environment variables.
 * Throws if required variables are missing in production.
 */
export function getEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

/**
 * Check if email service is configured.
 */
export function isEmailServiceConfigured(): boolean {
  const env = getEnv();
  return !!(env.RESEND_API_KEY && env.CONTACT_EMAIL);
}

/**
 * Get email service configuration.
 * Returns null if not configured.
 */
export function getEmailConfig(): {
  apiKey: string;
  contactEmail: string;
} | null {
  const env = getEnv();

  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
    return null;
  }

  return {
    apiKey: env.RESEND_API_KEY,
    contactEmail: env.CONTACT_EMAIL,
  };
}
