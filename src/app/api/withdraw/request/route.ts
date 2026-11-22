import { NextRequest, NextResponse } from 'next/server';
import { withdrawRequestSchema } from '@/lib/validation/schemas';
import { requestWithdrawal } from '@/lib/petition/service';
import { checkLimit } from '@/lib/security/ratelimit';
import { requestIp, validateJsonPost } from '@/lib/security/request';
import { verifyTurnstile } from '@/lib/security/turnstile';

export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const invalid = validateJsonPost(request);
  if (invalid) return invalid;
  const raw = await request.json().catch(() => null);
  if (
    raw &&
    typeof raw === 'object' &&
    typeof (raw as { website?: unknown }).website === 'string' &&
    (raw as { website: string }).website.length > 0
  )
    return NextResponse.json({
      ok: true,
      message: 'Si une signature existe, un e-mail sera envoyé.'
    });
  const parsed = withdrawRequestSchema.safeParse(raw);
  if (!parsed.success)
    return NextResponse.json({ error: 'Vérifiez les champs du formulaire.' }, { status: 400 });
  const input = parsed.data;
  const ip = requestIp(request);
  if (
    !(await checkLimit(`sign-ip:${ip}`, 30, 3600_000)) ||
    !(await verifyTurnstile(input.turnstileToken, ip))
  )
    return NextResponse.json({ error: 'Veuillez réessayer plus tard.' }, { status: 429 });
  try {
    await requestWithdrawal(input.email, input.locale);
    return NextResponse.json({
      ok: true,
      message:
        input.locale === 'fr'
          ? 'Si une signature existe, un e-mail sera envoyé.'
          : 'If a signature exists, an email will be sent.'
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'withdraw.request.failed',
        error: error instanceof Error ? error.name : 'unknown'
      })
    );
    return NextResponse.json({ error: 'Service momentanément indisponible.' }, { status: 503 });
  }
}
