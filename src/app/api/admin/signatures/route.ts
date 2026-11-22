import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase/admin';
import { verifyAdminCookie, SESSION_COOKIE } from '@/lib/admin/session';
import { signatureId } from '@/lib/security/tokens';
import { validateJsonPost } from '@/lib/security/request';
export const runtime = 'nodejs';
const mask = (email: string) => email.replace(/^(.).+(@.+)$/, '$1***$2');
export async function GET(request: NextRequest) {
  const admin = await verifyAdminCookie(request.cookies.get(SESSION_COOKIE)?.value);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const status = request.nextUrl.searchParams.get('status');
  const email = request.nextUrl.searchParams.get('email');
  let query: FirebaseFirestore.Query = db.collection('signatures');
  if (email) {
    const snap = await db.collection('signatures').doc(signatureId(email)).get();
    const d = snap.data();
    if (!d) return NextResponse.json({ signatures: [] });
    await db.collection('auditLogs').add({
      action: 'view_signature_email',
      adminEmail: admin.email,
      at: FieldValue.serverTimestamp(),
      meta: { idHash: snap.id.slice(0, 12) }
    });
    return NextResponse.json(
      {
        signatures: [
          {
            id: snap.id,
            firstName: d.firstName,
            lastName: d.lastName,
            email: d.email,
            region: d.region,
            city: d.city,
            status: d.status,
            createdAt: d.createdAt?.toDate().toISOString()
          }
        ]
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
  if (status) query = query.where('status', '==', status);
  const docs = await query.orderBy('createdAt', 'desc').limit(50).get();
  return NextResponse.json(
    {
      signatures: docs.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          firstName: d.firstName,
          lastName: d.lastName,
          email: mask(d.email),
          region: d.region,
          city: d.city,
          status: d.status,
          createdAt: d.createdAt?.toDate().toISOString(),
          publicHidden: d.publicHidden
        };
      })
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
export async function POST(request: NextRequest) {
  const invalid = validateJsonPost(request);
  if (invalid) return invalid;
  const admin = await verifyAdminCookie(request.cookies.get(SESSION_COOKIE)?.value);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { id?: string; action?: string } | null;
  if (
    !body?.id ||
    !/^[a-f0-9]{64}$/.test(body.id) ||
    !['delete', 'hide', 'verify'].includes(body.action || '')
  )
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  const ref = db.collection('signatures').doc(body.id);
  if (body.action === 'delete') await ref.delete();
  else if (body.action === 'hide') await ref.update({ publicHidden: true });
  else
    await ref.update({
      status: 'verified',
      verifiedAt: FieldValue.serverTimestamp(),
      verifyTokenHash: FieldValue.delete(),
      verifyTokenExpiresAt: FieldValue.delete()
    });
  await db.collection('auditLogs').add({
    action: body.action === 'delete' ? 'delete_signature' : 'review_signature',
    adminEmail: admin.email,
    at: FieldValue.serverTimestamp(),
    meta: { idHash: body.id.slice(0, 12), action: body.action }
  });
  return NextResponse.json({ ok: true });
}
