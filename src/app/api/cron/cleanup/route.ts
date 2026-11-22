import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase/admin';
import { env } from '@/lib/env';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${env.CRON_SECRET}`)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let removed = 0;
  const cutoff = Timestamp.fromMillis(Date.now() - 7 * 86400_000);
  const snapshots = await db
    .collection('signatures')
    .where('status', '==', 'pending')
    .where('createdAt', '<', cutoff)
    .limit(400)
    .get();
  const batch = db.batch();
  snapshots.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  removed = snapshots.size;
  return NextResponse.json({ ok: true, removed });
}
