'use client';
import { useState } from 'react';
import type { Locale } from '@/lib/constants';
export function UnsubscribeAction({
  id,
  sig,
  locale
}: {
  id: string;
  sig: string;
  locale: Locale;
}) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  async function submit() {
    try {
      const r = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, sig })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    }
  }
  return (
    <>
      {done ? (
        <p className="status-message" role="status">
          {locale === 'fr'
            ? 'Vous ne recevrez plus les actualités de la pétition.'
            : 'You will no longer receive petition updates.'}
        </p>
      ) : (
        <button className="primary-button" onClick={submit}>
          {locale === 'fr' ? 'Me désabonner' : 'Unsubscribe'}
        </button>
      )}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
