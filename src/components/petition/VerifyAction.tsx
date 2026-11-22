'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/constants';
export function VerifyAction({ id, token, locale }: { id: string; token: string; locale: Locale }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  async function verify() {
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      router.push(`/${locale}/merci`);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : locale === 'fr'
            ? 'Lien invalide ou expiré.'
            : 'Invalid or expired link.'
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button className="primary-button" onClick={verify} disabled={busy}>
        {busy
          ? locale === 'fr'
            ? 'Confirmation…'
            : 'Confirming…'
          : locale === 'fr'
            ? 'Confirmer ma signature'
            : 'Confirm my signature'}{' '}
        ↗
      </button>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
