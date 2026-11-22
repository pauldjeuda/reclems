import { env } from '../env';

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  if (
    env.NODE_ENV !== 'production' &&
    env.TURNSTILE_SECRET_KEY === '1x0000000000000000000000000000000AA'
  )
    return token.length > 0;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      cache: 'no-store'
    });
    const data = (await response.json()) as { success?: boolean };
    return response.ok && data.success === true;
  } catch {
    return false;
  }
}
