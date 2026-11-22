'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/constants';
export function WithdrawConfirmAction({
  id,
  token,
  locale
}: {
  id: string;
  token: string;
  locale: Locale;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  async function confirm() {
    setBusy(true);
    try {
      const r = await fetch('/api/withdraw/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMessage(
        locale === 'fr' ? 'Votre signature a été supprimée.' : 'Your signature has been deleted.'
      );
    } catch (e) {
      setMessage(
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
      <button className="primary-button" onClick={confirm} disabled={busy}>
        {busy
          ? locale === 'fr'
            ? 'Suppression…'
            : 'Removing…'
          : locale === 'fr'
            ? 'Confirmer le retrait'
            : 'Confirm removal'}
      </button>
      {message && (
        <p className="status-message" role="status">
          {message}{' '}
          <button className="share-button" onClick={() => router.push(`/${locale}`)}>
            {locale === 'fr' ? 'Accueil' : 'Home'}
          </button>
        </p>
      )}
    </>
  );
}
