import { NextRequest, NextResponse } from 'next/server';
import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase/admin';
import { verifyAdminCookie, SESSION_COOKIE } from '@/lib/admin/session';
import { validateJsonPost } from '@/lib/security/request';
import { sendEmail } from '@/lib/email';
import { unsubscribeSignature } from '@/lib/security/tokens';
import { env } from '@/lib/env';

export const runtime = 'nodejs';
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char
  );
export async function GET(request: NextRequest) {
  const admin = await verifyAdminCookie(request.cookies.get(SESSION_COOKIE)?.value);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const docs = await db.collection('campaigns').orderBy('createdAt', 'desc').limit(100).get();
  return NextResponse.json(
    { campaigns: docs.docs.map((doc) => ({ id: doc.id, ...doc.data() })) },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
export async function POST(request: NextRequest) {
  const invalid = validateJsonPost(request);
  if (invalid) return invalid;
  const admin = await verifyAdminCookie(request.cookies.get(SESSION_COOKIE)?.value);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await request.json().catch(() => null)) as {
    action?: string;
    id?: string;
    subject?: string;
    text?: string;
  } | null;
  if (!body?.action) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  if (body.action === 'create') {
    const subject = body.subject?.trim() || '';
    const text = body.text?.trim() || '';
    if (subject.length < 4 || subject.length > 180 || text.length < 20 || text.length > 8000)
      return NextResponse.json({ error: 'Sujet ou message invalide.' }, { status: 400 });
    const ref = await db.collection('campaigns').add({
      subject,
      body: text,
      status: 'draft',
      sentCount: 0,
      cursor: null,
      createdAt: FieldValue.serverTimestamp(),
      createdBy: admin.email
    });
    return NextResponse.json({ id: ref.id });
  }
  if (!body.id) return NextResponse.json({ error: 'Campaign id required' }, { status: 400 });
  const ref = db.collection('campaigns').doc(body.id);
  const campaignSnap = await ref.get();
  const campaign = campaignSnap.data();
  if (!campaign) return NextResponse.json({ error: 'Campagne introuvable.' }, { status: 404 });
  if (body.action === 'start') {
    if (campaign.status !== 'draft')
      return NextResponse.json({ error: 'La campagne n’est pas un brouillon.' }, { status: 409 });
    await ref.update({ status: 'sending', startedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ ok: true });
  }
  if (body.action === 'test') {
    const text = String(campaign.body);
    const previewUrl = `${env.NEXT_PUBLIC_SITE_URL}/fr/desabonnement`;
    await sendEmail({
      to: admin.email,
      subject: `[TEST] ${campaign.subject}`,
      text: `${text}\n\nDésabonnement : ${previewUrl}`,
      html: `<pre>${escapeHtml(text)}</pre>`
    });
    return NextResponse.json({ ok: true });
  }
  if (body.action === 'batch') {
    if (campaign.status !== 'sending')
      return NextResponse.json({ error: 'La campagne ne peut pas être envoyée.' }, { status: 409 });
    let query = db
      .collection('signatures')
      .where('status', '==', 'verified')
      .where('consentUpdates', '==', true)
      .orderBy(FieldPath.documentId())
      .limit(50);
    if (typeof campaign.cursor === 'string' && campaign.cursor)
      query = query.startAfter(campaign.cursor);
    const recipients = await query.get();
    if (recipients.empty) {
      await ref.update({ status: 'done', completedAt: FieldValue.serverTimestamp() });
      return NextResponse.json({ done: true, sentCount: campaign.sentCount });
    }
    let sent = 0;
    let cursor = String(campaign.cursor || '');
    for (const doc of recipients.docs) {
      cursor = doc.id;
      const data = doc.data();
      if (data.lastCampaignId === body.id) continue;
      const sig = unsubscribeSignature(doc.id);
      const page = `${env.NEXT_PUBLIC_SITE_URL}/fr/desabonnement?id=${doc.id}&sig=${sig}`;
      const oneClick = `${env.NEXT_PUBLIC_SITE_URL}/api/unsubscribe?id=${doc.id}&sig=${sig}`;
      const text = `${campaign.body}\n\nSe désabonner : ${page}`;
      await sendEmail({
        to: data.email,
        subject: String(campaign.subject),
        text,
        html: `<pre>${escapeHtml(String(campaign.body))}</pre><p><a href="${escapeHtml(page)}">Se désabonner</a></p>`,
        headers: {
          'List-Unsubscribe': `<${oneClick}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      });
      await doc.ref.update({ lastCampaignId: body.id });
      sent++;
    }
    await ref.update({ cursor, sentCount: FieldValue.increment(sent) });
    return NextResponse.json({
      done: recipients.size < 50,
      sentThisBatch: sent,
      sentCount: Number(campaign.sentCount || 0) + sent,
      cursor
    });
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
