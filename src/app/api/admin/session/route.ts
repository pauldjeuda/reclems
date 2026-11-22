import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase/admin';
import { allowedAdmin, SESSION_COOKIE, verifyAdminCookie } from '@/lib/admin/session';
import { validateJsonPost } from '@/lib/security/request';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const invalid = validateJsonPost(request);
  if (invalid) return invalid;
  const body = (await request.json().catch(() => null)) as {
    idToken?: string;
    logout?: boolean;
  } | null;
  if (body?.logout) {
    const session = await verifyAdminCookie(request.cookies.get(SESSION_COOKIE)?.value);
    if (session)
      await getAuth(adminApp)
        .revokeRefreshTokens(session.uid)
        .catch(() => undefined);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0
    });
    return response;
  }
  if (!body?.idToken || body.idToken.length > 10000)
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  try {
    const decoded = await getAuth(adminApp).verifyIdToken(body.idToken, true);
    if (!decoded.email || !decoded.email_verified || !allowedAdmin(decoded.email))
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
    const cookie = await getAuth(adminApp).createSessionCookie(body.idToken, {
      expiresIn: 8 * 60 * 60 * 1000
    });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, cookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 60 * 60
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
}
