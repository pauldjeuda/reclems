import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { verifyAdminCookie, SESSION_COOKIE } from '@/lib/admin/session';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  if (!(await verifyAdminCookie(request.cookies.get(SESSION_COOKIE)?.value)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const docs = await db.collection('auditLogs').orderBy('at', 'desc').limit(100).get();
  return NextResponse.json(
    {
      events: docs.docs.map((doc) => {
        const d = doc.data();
        return {
          action: d.action,
          adminEmail: d.adminEmail,
          at: d.at?.toDate().toISOString(),
          meta: d.meta || {}
        };
      })
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
