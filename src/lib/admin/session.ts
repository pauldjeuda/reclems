import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminApp } from '../firebase/admin';
import { env } from '../env';

export const SESSION_COOKIE = '__session';
export const allowedAdmin = (email: string) =>
  env.ADMIN_EMAILS.split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
export async function verifyAdminCookie(cookie?: string) {
  if (!cookie) return null;
  try {
    const decoded = await getAuth(adminApp).verifySessionCookie(cookie, true);
    const email = decoded.email;
    if (!email || !decoded.email_verified || !allowedAdmin(email)) return null;
    return { email, uid: decoded.uid };
  } catch {
    return null;
  }
}
export async function requireAdmin() {
  const jar = await cookies();
  const admin = await verifyAdminCookie(jar.get(SESSION_COOKIE)?.value);
  if (!admin) redirect('/admin/login');
  return admin;
}
