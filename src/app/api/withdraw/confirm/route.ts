import { NextRequest, NextResponse } from 'next/server';
import { tokenSchema } from '@/lib/validation/schemas';
import { confirmWithdrawal } from '@/lib/petition/service';
import { validateJsonPost } from '@/lib/security/request';

export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const invalid = validateJsonPost(request);
  if (invalid) return invalid;
  const parsed = tokenSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: 'Lien invalide ou expiré.' }, { status: 400 });
  try {
    const ok = await confirmWithdrawal(parsed.data.id, parsed.data.token);
    return ok
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: 'Lien invalide ou expiré.' }, { status: 400 });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'withdraw.confirm.failed',
        error: error instanceof Error ? error.name : 'unknown'
      })
    );
    return NextResponse.json({ error: 'Service momentanément indisponible.' }, { status: 503 });
  }
}
