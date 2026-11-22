import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resendVerification } from '@/lib/petition/service';
import { checkLimit } from '@/lib/security/ratelimit';
import { requestIp, validateJsonPost } from '@/lib/security/request';
import { normalizeEmail } from '@/lib/security/tokens';
import { verifyTurnstile } from '@/lib/security/turnstile';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const invalid = validateJsonPost(request);
  if (invalid) return invalid;
  const body = await request.json().catch(() => null);
  const parsed = z
    .object({
      email: z.email().max(254),
      locale: z.enum(['fr', 'en']).default('fr'),
      turnstileToken: z.string().min(1)
    })
    .strict()
    .safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const ip = requestIp(request);
  const email = normalizeEmail(parsed.data.email);
  if (
    !(await checkLimit(`sign-ip:${ip}`, 30, 3600_000)) ||
    !(await checkLimit(`sign-email:${email}`, 3, 86400_000)) ||
    !(await verifyTurnstile(parsed.data.turnstileToken, ip))
  )
    return NextResponse.json({ error: 'Veuillez réessayer plus tard.' }, { status: 429 });
  try {
    await resendVerification(email, parsed.data.locale);
    return NextResponse.json({
      ok: true,
      message:
        parsed.data.locale === 'fr'
          ? 'Si une adresse correspond, un e-mail a été envoyé.'
          : 'If an address matches, an email has been sent.'
    });
  } catch {
    return NextResponse.json({ error: 'Service momentanément indisponible.' }, { status: 503 });
  }
}
