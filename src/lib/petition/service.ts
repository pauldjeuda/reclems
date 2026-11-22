import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db } from '../firebase/admin';
import { env } from '../env';
import {
  ipFingerprint,
  normalizeEmail,
  randomToken,
  sha256,
  signatureId,
  verifyToken
} from '../security/tokens';
import { sendEmail } from '../email';
import { getPetitionConfig } from './config';
import type { Locale } from '../constants';

const verifySubject: Record<Locale, string> = {
  fr: 'Confirmez votre signature',
  en: 'Confirm your signature'
};
export async function createSignature(input: {
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  city?: string | null;
  locale: Locale;
  consentUpdates: boolean;
  publicDisplay: boolean;
  src?: string | null;
  ip: string;
}) {
  const cfg = await getPetitionConfig();
  if (!cfg.isOpen) return { closed: true };
  const normalized = normalizeEmail(input.email);
  const id = signatureId(normalized);
  const ref = db.collection('signatures').doc(id);
  const token = randomToken();
  const now = Timestamp.now();
  let shouldSend = false;
  await db.runTransaction(async (tx) => {
    const current = await tx.get(ref);
    const prior = current.data();
    if (prior?.status === 'verified') return;
    if (
      prior?.status === 'pending' &&
      prior.lastEmailSentAt &&
      now.toMillis() - prior.lastEmailSentAt.toMillis() < 10 * 60_000
    )
      return;
    const count = await db
      .collection('signatures')
      .where('ipHash', '==', ipFingerprint(input.ip))
      .where('createdAt', '>', Timestamp.fromMillis(now.toMillis() - 60 * 60_000))
      .count()
      .get();
    const flagged = count.data().count >= env.FLAG_IP_THRESHOLD;
    tx.set(
      ref,
      {
        email: normalized,
        firstName: input.firstName,
        lastName: input.lastName,
        region: input.region,
        city: input.city || null,
        locale: input.locale,
        status: flagged ? 'flagged' : 'pending',
        verifyTokenHash: sha256(token),
        verifyTokenExpiresAt: Timestamp.fromMillis(now.toMillis() + 48 * 60 * 60_000),
        withdrawTokenHash: null,
        withdrawTokenExpiresAt: null,
        consentTermsAt: prior?.consentTermsAt ?? now,
        consentUpdates: input.consentUpdates,
        publicDisplay: input.publicDisplay,
        src: input.src ?? null,
        ipHash: ipFingerprint(input.ip),
        createdAt: prior?.createdAt ?? now,
        lastEmailSentAt: now,
        verifiedAt: null,
        publicHidden: false,
        lastCampaignId: null
      },
      { merge: true }
    );
    shouldSend = true;
  });
  if (shouldSend) {
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${input.locale}/verify?id=${id}&token=${token}`;
    const copy =
      input.locale === 'fr'
        ? `Cliquez sur ce lien pour confirmer votre signature : ${verifyUrl}\nCe lien expire dans 48 heures.`
        : `Use this link to confirm your signature: ${verifyUrl}\nThis link expires in 48 hours.`;
    await sendEmail({
      to: normalized,
      subject: verifySubject[input.locale],
      text: copy,
      html: `<p>${copy.replaceAll('\n', '<br>')}</p>`,
      replyTo: process.env.CONTACT_EMAIL
    });
  }
  return { closed: false, id };
}

export async function verifySignature(id: string, token: string) {
  const ref = db.collection('signatures').doc(id);
  const snap = await ref.get();
  const data = snap.data();
  if (
    !data ||
    data.status === 'verified' ||
    !data.verifyTokenHash ||
    data.verifyTokenExpiresAt.toMillis() < Date.now() ||
    !verifyToken(token, data.verifyTokenHash)
  )
    return false;
  await db.runTransaction(async (tx) => {
    const latest = await tx.get(ref);
    const current = latest.data();
    if (
      (current?.status === 'pending' || current?.status === 'flagged') &&
      current.verifyTokenHash &&
      verifyToken(token, current.verifyTokenHash) &&
      current.verifyTokenExpiresAt.toMillis() >= Date.now()
    )
      tx.update(ref, {
        status: current.status === 'pending' ? 'verified' : 'flagged',
        verifiedAt: FieldValue.serverTimestamp(),
        verifyTokenHash: FieldValue.delete(),
        verifyTokenExpiresAt: FieldValue.delete()
      });
  });
  const updated = await ref.get();
  return updated.data()?.status === 'verified' || updated.data()?.status === 'flagged';
}

export async function resendVerification(email: string, locale: Locale) {
  const id = signatureId(email);
  const ref = db.collection('signatures').doc(id);
  const token = randomToken();
  const now = Timestamp.now();
  let recipient: string | null = null;
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data();
    if (!data || !['pending', 'flagged'].includes(data.status) || !data.verifyTokenHash) return;
    if (data.lastEmailSentAt && now.toMillis() - data.lastEmailSentAt.toMillis() < 10 * 60_000)
      return;
    tx.update(ref, {
      verifyTokenHash: sha256(token),
      verifyTokenExpiresAt: Timestamp.fromMillis(now.toMillis() + 48 * 60 * 60_000),
      lastEmailSentAt: now
    });
    recipient = data.email;
  });
  if (recipient) {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${locale}/verify?id=${id}&token=${token}`;
    const text =
      locale === 'fr' ? `Confirmez votre signature : ${url}` : `Confirm your signature: ${url}`;
    await sendEmail({
      to: recipient,
      subject: locale === 'fr' ? 'Confirmez votre signature' : 'Confirm your signature',
      text,
      html: `<p>${text}</p>`,
      replyTo: process.env.CONTACT_EMAIL
    });
  }
}

export async function requestWithdrawal(email: string, locale: Locale) {
  const id = signatureId(email);
  const ref = db.collection('signatures').doc(id);
  const snap = await ref.get();
  const data = snap.data();
  if (!data) return;
  const token = randomToken();
  const now = Timestamp.now();
  await ref.update({
    withdrawTokenHash: sha256(token),
    withdrawTokenExpiresAt: Timestamp.fromMillis(now.toMillis() + 24 * 60 * 60_000)
  });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${locale}/retrait/confirmer?id=${id}&token=${token}`;
  const text =
    locale === 'fr'
      ? `Confirmez le retrait de votre signature : ${url}`
      : `Confirm removal of your signature: ${url}`;
  await sendEmail({
    to: data.email,
    subject:
      locale === 'fr' ? 'Confirmez le retrait de votre signature' : 'Confirm signature removal',
    text,
    html: `<p>${text}</p>`,
    replyTo: process.env.CONTACT_EMAIL
  });
}

export async function confirmWithdrawal(id: string, token: string) {
  const ref = db.collection('signatures').doc(id);
  let deleted = false;
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data();
    const expiresAt = data?.withdrawTokenExpiresAt?.toMillis();
    if (
      data?.withdrawTokenHash &&
      verifyToken(token, data.withdrawTokenHash) &&
      typeof expiresAt === 'number' &&
      expiresAt >= Date.now()
    ) {
      tx.delete(ref);
      tx.create(db.collection('auditLogs').doc(), {
        action: 'delete_signature',
        at: FieldValue.serverTimestamp(),
        meta: { idHash: id.slice(0, 12) }
      });
      deleted = true;
    }
  });
  return deleted;
}

export async function unsubscribe(id: string) {
  const ref = db.collection('signatures').doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.update({ consentUpdates: false });
  return true;
}
