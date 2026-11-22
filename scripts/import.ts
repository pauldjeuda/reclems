import { loadEnvConfig } from '@next/env';
import { parse } from 'csv-parse/sync';
import { Timestamp } from 'firebase-admin/firestore';
import { promises as fs } from 'node:fs';
import path from 'node:path';

loadEnvConfig(process.cwd());
const args = process.argv.slice(2);
const file = args.find((arg) => arg.endsWith('.csv'));
if (!file) {
  throw new Error(
    'Usage: pnpm tsx scripts/import.ts backup.csv [--dry-run | --apply --confirm IMPORTER]'
  );
}
const apply = args.includes('--apply');
if (apply && (!args.includes('--confirm') || args[args.indexOf('--confirm') + 1] !== 'IMPORTER'))
  throw new Error('Writing requires --apply --confirm IMPORTER');
const content = await fs.readFile(path.resolve(file), 'utf8');
const rows = parse(content, { columns: true, skip_empty_lines: true, trim: true }) as Record<
  string,
  string
>[];
for (const row of rows) {
  if (
    !row.email ||
    !row.firstName ||
    !row.lastName ||
    !row.region ||
    !['pending', 'verified', 'flagged'].includes(row.status)
  )
    throw new Error('CSV has missing or invalid required columns.');
}
console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', records: rows.length }));
if (!apply) process.exit(0);
const { db } = await import('../src/lib/firebase/admin');
const batchSize = 400;
for (let offset = 0; offset < rows.length; offset += batchSize) {
  const batch = db.batch();
  for (const row of rows.slice(offset, offset + batchSize)) {
    const id = row.id;
    if (!id || !/^[a-f0-9]{64}$/.test(id))
      throw new Error('CSV rows must contain a precomputed 64-character id column.');
    const ref = db.collection('signatures').doc(id);
    batch.set(
      ref,
      {
        ...row,
        consentUpdates: row.consentUpdates === 'true',
        publicDisplay: row.publicDisplay === 'true',
        publicHidden: row.publicHidden === 'true',
        createdAt: row.createdAt ? Timestamp.fromDate(new Date(row.createdAt)) : Timestamp.now()
      },
      { merge: true }
    );
  }
  await batch.commit();
}
console.log(JSON.stringify({ event: 'import.complete', records: rows.length }));
