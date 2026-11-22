import { NextRequest, NextResponse } from 'next/server';
import { signSchema } from '@/lib/validation/schemas';
import { createSignature } from '@/lib/petition/service';
import { checkLimit } from '@/lib/security/ratelimit';
import { requestIp, validateJsonPost } from '@/lib/security/request';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { isDisposableEmail } from '@/lib/security/disposable-domains';
import { normalizeEmail } from '@/lib/security/tokens';

export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const invalid = validateJsonPost(request);
  if (invalid) return invalid;
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (
    raw &&
    typeof raw === 'object' &&
    typeof (raw as { website?: unknown }).website === 'string' &&
    (raw as { website: string }).website.length > 0
  )
    return NextResponse.json({
      ok: true,
      message: 'Si l’adresse est valide, un e-mail de confirmation a été envoyé.'
    });
  const parsed = signSchema.safeParse(raw);
  if (!parsed.success)
    return NextResponse.json({ error: 'Vérifiez les champs du formulaire.' }, { status: 400 });
  const input = parsed.data;
  const ip = requestIp(request);
  const email = normalizeEmail(input.email);
  if (
    !(await checkLimit(`sign-ip:${ip}`, 30, 3600_000)) ||
    !(await checkLimit(`sign-email:${email}`, 3, 86400_000))
  )
    return NextResponse.json({ error: 'Veuillez réessayer plus tard.' }, { status: 429 });
  if (isDisposableEmail(email) || !(await verifyTurnstile(input.turnstileToken, ip)))
    return NextResponse.json({ error: 'Vérification anti-robot invalide.' }, { status: 400 });
  try {
    const result = await createSignature({ ...input, email, ip });
    if (result.closed)
      return NextResponse.json({ error: 'Cette pétition est clôturée.' }, { status: 409 });
    return NextResponse.json({
      ok: true,
      message: 'Si l’adresse est valide, un e-mail de confirmation a été envoyé.'
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'signature.create.failed',
        error: error instanceof Error ? error.name : 'unknown'
      })
    );
    return NextResponse.json({ error: 'Service momentanément indisponible.' }, { status: 503 });
  }
}
