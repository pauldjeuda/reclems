import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().default('1x00000000000000000000AA'),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  EMAIL_PROVIDER: z.enum(['console', 'brevo', 'resend']).default('console'),
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Petition <no-reply@example.org>'),
  CONTACT_EMAIL: z.string().email().default('contact@example.org'),
  EMAIL_PEPPER: z.string().default('local-email-pepper-change-me-32-bytes'),
  IP_PEPPER: z.string().default('local-ip-pepper-change-me-32-bytes'),
  UNSUB_SECRET: z.string().default('local-unsubscribe-secret-change-me'),
  ADMIN_EMAILS: z.string().default(''),
  TURNSTILE_SECRET_KEY: z.string().default('1x0000000000000000000000000000000AA'),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  CRON_SECRET: z.string().default('local-cron-secret-change-me'),
  FLAG_IP_THRESHOLD: z.coerce.number().int().positive().default(60)
});

export const env = schema.parse(process.env);
if (env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
  const required = [
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
    'TURNSTILE_SECRET_KEY',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'EMAIL_PEPPER',
    'IP_PEPPER',
    'UNSUB_SECRET',
    'CRON_SECRET',
    'ADMIN_EMAILS',
    'EMAIL_FROM',
    'CONTACT_EMAIL',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN'
  ] as const;
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length)
    throw new Error(`Missing production environment variables: ${missing.join(', ')}`);
  if (env.EMAIL_PROVIDER === 'console')
    throw new Error('EMAIL_PROVIDER must be brevo or resend in production.');
  if (!env.EMAIL_API_KEY)
    throw new Error('EMAIL_API_KEY is required for the selected email provider.');
  if (!env.NEXT_PUBLIC_SITE_URL.startsWith('https://'))
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS in production.');
  if (
    env.TURNSTILE_SECRET_KEY === '1x0000000000000000000000000000000AA' ||
    env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === '1x00000000000000000000AA'
  )
    throw new Error('Production must use real Turnstile keys, not test keys.');
}
