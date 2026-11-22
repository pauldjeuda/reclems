import { NextResponse } from 'next/server';
import { verifyAdminCookie, SESSION_COOKIE } from '@/lib/admin/session';
import { getAdminStats } from '@/lib/petition/stats';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  const admin = await verifyAdminCookie(
    (request as import('next/server').NextRequest).cookies.get(SESSION_COOKIE)?.value
  );
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json(await getAdminStats(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  }
}
