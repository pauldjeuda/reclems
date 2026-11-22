'use client';
import { useState } from 'react';
import type { Locale } from '@/lib/constants';
import { Turnstile } from './Turnstile';
export function WithdrawForm({ locale }: { locale: Locale }) {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const email = new FormData(e.currentTarget).get('email');
    try {
      const r = await fetch('/api/withdraw/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale, turnstileToken: token || 'local-turnstile-pass' })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMessage(d.message);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : locale === 'fr' ? 'Erreur réseau.' : 'Network error.'
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="form-card" onSubmit={submit}>
      <div className="field">
        <label htmlFor="withdraw-email">{locale === 'fr' ? 'E-mail' : 'Email'}</label>
        <input
          id="withdraw-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
      </div>
      <Turnstile locale={locale} onToken={setToken} />
      {message && (
        <p className="status-message" role="status">
          {message}
        </p>
      )}
      <button className="primary-button" disabled={busy}>
        {busy
          ? locale === 'fr'
            ? 'Envoi…'
            : 'Sending…'
          : locale === 'fr'
            ? 'Recevoir un lien de retrait'
            : 'Send me a withdrawal link'}{' '}
        ↗
      </button>
    </form>
  );
}
