import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation/schemas';
import { sendEmail } from '@/lib/email';
import { checkLimit } from '@/lib/security/ratelimit';
import { requestIp, validateJsonPost } from '@/lib/security/request';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { env } from '@/lib/env';
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
    return NextResponse.json({ ok: true });
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success)
    return NextResponse.json({ error: 'Vérifiez les champs du formulaire.' }, { status: 400 });
  const input = parsed.data;
  const ip = requestIp(request);
  if (
    !(await checkLimit(`contact-ip:${ip}`, 3, 3600_000)) ||
    !(await checkLimit(`contact-email:${input.email}`, 3, 86400_000))
  )
    return NextResponse.json({ error: 'Veuillez réessayer plus tard.' }, { status: 429 });
  if (!(await verifyTurnstile(input.turnstileToken, ip)))
    return NextResponse.json({ error: 'Vérification anti-robot invalide.' }, { status: 400 });
  try {
    const text = `De: ${input.name} <${input.email}>\nOrganisation: ${input.organization || '—'}\nSujet: ${input.subject}\n\n${input.message}`;
    const escaped = text.replace(
      /[&<>"']/g,
      (char) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char
    );
    await sendEmail({
      to: env.CONTACT_EMAIL,
      replyTo: input.email,
      subject: `Contact pétition — ${input.subject}`,
      text,
      html: `<pre>${escaped}</pre>`,
      logText: false
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'contact.send.failed',
        error: error instanceof Error ? error.name : 'unknown'
      })
    );
    return NextResponse.json({ error: 'Envoi impossible pour le moment.' }, { status: 503 });
  }
}
