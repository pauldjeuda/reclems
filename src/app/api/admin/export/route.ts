import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase/admin';
import { verifyAdminCookie, SESSION_COOKIE } from '@/lib/admin/session';
import { getAdminStats } from '@/lib/petition/stats';
import { validateJsonPost } from '@/lib/security/request';
export const runtime = 'nodejs';
const safe = (value: unknown) => {
  let cell = String(value ?? '');
  if (/^[=+\-@]/.test(cell)) cell = `'${cell}`;
  return `"${cell.replaceAll('"', '""')}"`;
};
const csv = (rows: unknown[][]) => rows.map((row) => row.map(safe).join(',')).join('\r\n');
export async function POST(request: NextRequest) {
  const invalid = validateJsonPost(request);
  if (invalid) return invalid;
  const admin = await verifyAdminCookie(request.cookies.get(SESSION_COOKIE)?.value);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await request.json().catch(() => null)) as {
    type?: string;
    confirmation?: string;
  } | null;
  if (!body || !['aggregate', 'full'].includes(body.type || ''))
    return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
  if (body.type === 'full' && body.confirmation !== 'EXPORTER')
    return NextResponse.json({ error: 'Confirmation required' }, { status: 400 });
  let output: string;
  let name: string;
  if (body.type === 'aggregate') {
    const stats = await getAdminStats();
    const rows: unknown[][] = [
      ['type', 'label', 'count'],
      ...Object.entries(stats.byRegion).map(([label, count]) => ['region', label, count]),
      ...Object.entries(stats.bySource).map(([label, count]) => ['source', label, count]),
      ...stats.daily.map((day) => ['day', day.date, day.count])
    ];
    output = csv(rows);
    name = 'petition-aggregate.csv';
    await db.collection('auditLogs').add({
      action: 'export_aggregate',
      adminEmail: admin.email,
      at: FieldValue.serverTimestamp(),
      meta: { records: rows.length - 1 }
    });
  } else {
    const docs = await db.collection('signatures').orderBy('createdAt', 'asc').get();
    const fields = [
      'id',
      'email',
      'firstName',
      'lastName',
      'region',
      'city',
      'locale',
      'status',
      'consentUpdates',
      'publicDisplay',
      'src',
      'createdAt',
      'verifiedAt'
    ];
    const rows: unknown[][] = [
      fields,
      ...docs.docs.map((doc) =>
        fields.map((field) => {
          if (field === 'id') return doc.id;
          const value = doc.get(field);
          return value?.toDate instanceof Function ? value.toDate().toISOString() : value;
        })
      )
    ];
    output = csv(rows);
    name = 'petition-backup.csv';
    await db.collection('auditLogs').add({
      action: 'export_full',
      adminEmail: admin.email,
      at: FieldValue.serverTimestamp(),
      meta: { records: docs.size }
    });
  }
  return new NextResponse(output, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name}"`,
      'Cache-Control': 'no-store'
    }
  });
}
