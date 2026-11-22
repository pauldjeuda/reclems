import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { env } from '../env';

const memory = new Map<string, number[]>();
const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : null;
const limiters = redis
  ? {
      signatureIp: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, '1 h'),
        prefix: 'petition:sign:ip'
      }),
      signatureEmail: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '24 h'),
        prefix: 'petition:sign:email'
      }),
      contactIp: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        prefix: 'petition:contact:ip'
      }),
      contactEmail: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '24 h'),
        prefix: 'petition:contact:email'
      })
    }
  : null;

export async function checkLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (limiters && key.includes(':')) {
    const [kind, id] = key.split(':', 2);
    const limiter =
      kind === 'sign-ip'
        ? limiters.signatureIp
        : kind === 'sign-email'
          ? limiters.signatureEmail
          : kind === 'contact-ip'
            ? limiters.contactIp
            : limiters.contactEmail;
    const result = await limiter.limit(id ?? 'unknown');
    return result.success;
  }
  const now = Date.now();
  const active = (memory.get(key) ?? []).filter((at) => now - at < windowMs);
  if (active.length >= limit) {
    memory.set(key, active);
    return false;
  }
  active.push(now);
  memory.set(key, active);
  return true;
}
