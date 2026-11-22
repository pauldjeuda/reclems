import { describe, expect, it } from 'vitest';
import {
  normalizeEmail,
  signatureId,
  randomToken,
  sha256,
  safeEqual
} from '../../src/lib/security/tokens';
import { signSchema } from '../../src/lib/validation/schemas';
import { isDisposableEmail } from '../../src/lib/security/disposable-domains';
import { isPublicNameAllowed } from '../../src/lib/security/profanity';

describe('signature identity and validation', () => {
  it('normalizes Gmail aliases without changing other providers', () => {
    expect(normalizeEmail(' Jane.Doe+petition@googlemail.com ')).toBe('janedoe@gmail.com');
    expect(normalizeEmail('JANE.DOE+tag@example.org')).toBe('jane.doe+tag@example.org');
  });
  it('creates stable opaque identifiers and random tokens', () => {
    expect(signatureId('TEST@example.org')).toBe(signatureId('test@example.org'));
    expect(signatureId('test@example.org')).toMatch(/^[a-f0-9]{64}$/);
    expect(randomToken()).not.toBe(randomToken());
  });
  it('hashes tokens and compares in constant-time helper', () => {
    expect(sha256('token')).toHaveLength(64);
    expect(safeEqual('abc', 'abc')).toBe(true);
    expect(safeEqual('abc', 'abd')).toBe(false);
  });
  it('rejects invalid signatures and disposable email domains', () => {
    expect(signSchema.safeParse({}).success).toBe(false);
    expect(isDisposableEmail('person@mailinator.com')).toBe(true);
    expect(isDisposableEmail('person@example.org')).toBe(false);
  });
  it('filters public display names', () => {
    expect(isPublicNameAllowed('Amina')).toBe(true);
    expect(isPublicNameAllowed('Shithead')).toBe(false);
  });
});
