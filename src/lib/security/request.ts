import { NextResponse, type NextRequest } from 'next/server';
import { env } from '../env';

export function validateJsonPost(request: NextRequest): NextResponse | null {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json'))
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(env.NEXT_PUBLIC_SITE_URL).origin)
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  if (!origin && env.NODE_ENV === 'production')
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  return null;
}
export function requestIp(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}
