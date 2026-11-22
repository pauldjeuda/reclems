import { randomBytes } from 'node:crypto';
for (const name of ['EMAIL_PEPPER', 'IP_PEPPER', 'UNSUB_SECRET', 'CRON_SECRET'])
  console.log(`${name}=${randomBytes(32).toString('hex')}`);
