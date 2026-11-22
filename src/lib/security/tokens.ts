import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { env } from '../env';

export const randomToken = () => randomBytes(32).toString('base64url');
export const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');
export const normalizeEmail = (email: string) => {
  const [rawLocal = '', rawDomain = ''] = email.trim().toLowerCase().split('@');
  const domain = rawDomain === 'googlemail.com' ? 'gmail.com' : rawDomain;
  const local = domain === 'gmail.com' ? rawLocal.split('+')[0].replaceAll('.', '') : rawLocal;
  return `${local}@${domain}`;
};
export const signatureId = (email: string) =>
  createHmac('sha256', env.EMAIL_PEPPER).update(normalizeEmail(email)).digest('hex');
export const ipFingerprint = (ip: string) =>
  createHmac('sha256', env.IP_PEPPER).update(ip).digest('hex');
export const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};
export const verifyToken = (provided: string, expectedHash: string) =>
  safeEqual(sha256(provided), expectedHash);
export const unsubscribeSignature = (id: string) =>
  createHmac('sha256', env.UNSUB_SECRET).update(id).digest('hex');
export const validUnsubscribeSignature = (id: string, sig: string) =>
  safeEqual(unsubscribeSignature(id), sig);
