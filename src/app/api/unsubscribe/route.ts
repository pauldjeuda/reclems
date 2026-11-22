import { NextRequest, NextResponse } from 'next/server';
import { unsubscribe } from '@/lib/petition/service';
import { validUnsubscribeSignature } from '@/lib/security/tokens';
import { validateJsonPost } from '@/lib/security/request';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  let id = request.nextUrl.searchParams.get('id') || '';
  let sig = request.nextUrl.searchParams.get('sig') || '';
  if (request.headers.get('content-type')?.includes('application/json')) {
    const invalid = validateJsonPost(request);
    if (invalid) return invalid;
    const body = (await request.json().catch(() => null)) as { id?: string; sig?: string } | null;
    id = body?.id || '';
    sig = body?.sig || '';
  }
  if (!id || !sig || !validUnsubscribeSignature(id, sig))
    return NextResponse.json({ error: 'Lien invalide.' }, { status: 400 });
  try {
    await unsubscribe(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Service momentanément indisponible.' }, { status: 503 });
  }
}
