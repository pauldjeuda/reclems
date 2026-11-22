import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase/admin';
import { verifyAdminCookie, SESSION_COOKIE } from '@/lib/admin/session';
import { validateJsonPost } from '@/lib/security/request';
import { getPetitionConfig } from '@/lib/petition/config';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  if (!(await verifyAdminCookie(request.cookies.get(SESSION_COOKIE)?.value)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await getPetitionConfig(), { headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(request: NextRequest) {
  const invalid = validateJsonPost(request);
  if (invalid) return invalid;
  const admin = await verifyAdminCookie(request.cookies.get(SESSION_COOKIE)?.value);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await request.json().catch(() => null)) as {
    isOpen?: boolean;
    goal?: number;
  } | null;
  if (
    typeof body?.isOpen !== 'boolean' ||
    !Number.isInteger(body.goal) ||
    !body.goal ||
    body.goal < 1 ||
    body.goal > 100000000
  )
    return NextResponse.json({ error: 'Invalid settings' }, { status: 400 });
  await db.doc('config/petition').set(
    {
      isOpen: body.isOpen,
      goal: body.goal,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: admin.email
    },
    { merge: true }
  );
  await db.collection('auditLogs').add({
    action: 'config_update',
    adminEmail: admin.email,
    at: FieldValue.serverTimestamp(),
    meta: { isOpen: body.isOpen, goal: body.goal }
  });
  return NextResponse.json({ ok: true });
}
