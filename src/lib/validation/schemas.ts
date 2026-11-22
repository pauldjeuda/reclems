import { z } from 'zod';
import { REGIONS } from '../constants';

const person = z
  .string()
  .trim()
  .min(2)
  .max(60)
  .regex(/^[\p{L}\p{M}' -]+$/u);
const email = z
  .email()
  .max(254)
  .transform((value) => value.trim().toLowerCase());
export const signSchema = z
  .object({
    firstName: person,
    lastName: person,
    email,
    region: z.enum(REGIONS),
    city: z.string().trim().max(60).nullable().optional(),
    locale: z.enum(['fr', 'en']).default('fr'),
    consentTerms: z.literal(true),
    consentUpdates: z.boolean().default(false),
    publicDisplay: z.boolean().default(false),
    src: z.enum(['whatsapp', 'facebook', 'x', 'tiktok', 'direct', 'other']).nullable().optional(),
    turnstileToken: z.string().min(1),
    website: z.string().max(0).optional()
  })
  .strict();
export const tokenSchema = z
  .object({ id: z.string().regex(/^[a-f0-9]{64}$/), token: z.string().min(16).max(128) })
  .strict();
export const withdrawRequestSchema = z
  .object({
    email,
    locale: z.enum(['fr', 'en']).default('fr'),
    turnstileToken: z.string().min(1),
    website: z.string().max(0).optional()
  })
  .strict();
export const contactSchema = z
  .object({
    name: person,
    email,
    subject: z.enum(['question', 'testimonial', 'press', 'partnership', 'withdrawal', 'other']),
    organization: z.string().trim().max(120).optional(),
    message: z.string().trim().min(20).max(4000),
    consent: z.literal(true),
    turnstileToken: z.string().min(1),
    website: z.string().max(0).optional()
  })
  .strict();
