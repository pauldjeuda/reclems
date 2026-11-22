import { loadEnvConfig } from '@next/env';
import { createHmac } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
loadEnvConfig(process.cwd());
const oldPepper = process.env.OLD_EMAIL_PEPPER;
const apply = process.argv.includes('--apply');
if (!oldPepper) throw new Error('Set OLD_EMAIL_PEPPER to the current pepper.');
if (
  apply &&
  (!process.argv.includes('--confirm') ||
    process.argv[process.argv.indexOf('--confirm') + 1] !== 'MIGRATE')
)
  throw new Error('Writing requires --apply --confirm MIGRATE.');
const { db } = await import('../src/lib/firebase/admin');
const docs = await db.collection('signatures').get();
const currentPepper = process.env.EMAIL_PEPPER;
if (!currentPepper) throw new Error('Set EMAIL_PEPPER to the replacement pepper.');
const normalized = (email: string) => {
  const [rawLocal = '', rawDomain = ''] = email.trim().toLowerCase().split('@');
  const domain = rawDomain === 'googlemail.com' ? 'gmail.com' : rawDomain;
  const local = domain === 'gmail.com' ? rawLocal.split('+')[0].replaceAll('.', '') : rawLocal;
  return `${local}@${domain}`;
};
const hmac = (email: string, pepper: string) =>
  createHmac('sha256', pepper).update(normalized(email)).digest('hex');
const moves = docs.docs
  .map((doc) => ({
    from: doc.id,
    to: hmac(String(doc.get('email')), currentPepper),
    data: doc.data()
  }))
  .filter((row) => row.from !== row.to);
console.log(
  JSON.stringify({ mode: apply ? 'apply' : 'dry-run', documents: docs.size, moves: moves.length })
);
if (apply) {
  for (const row of moves) {
    const to = db.collection('signatures').doc(row.to);
    await db.runTransaction(async (tx) => {
      const existing = await tx.get(to);
      if (existing.exists) throw new Error('Target id collision; stop and investigate.');
      tx.set(to, { ...row.data, pepperMigratedAt: FieldValue.serverTimestamp() });
      tx.delete(db.collection('signatures').doc(row.from));
    });
  }
}
