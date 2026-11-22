'use client';
import { useState } from 'react';
import type { Locale } from '@/lib/constants';
import { Turnstile } from './Turnstile';
const copy = {
  fr: {
    name: 'Nom',
    email: 'E-mail',
    subject: 'Sujet',
    org: 'Organisation (facultatif)',
    message: 'Message',
    consent: 'J’accepte que mes données soient utilisées pour répondre à cette demande.',
    send: 'Envoyer',
    sent: 'Votre message a été envoyé.',
    error: 'Envoi impossible pour le moment.'
  },
  en: {
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    org: 'Organisation (optional)',
    message: 'Message',
    consent: 'I agree that my data may be used to respond to this request.',
    send: 'Send',
    sent: 'Your message has been sent.',
    error: 'Unable to send your message right now.'
  }
} as const;
export function ContactForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus('');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          organization: data.get('organization'),
          message: data.get('message'),
          consent: data.get('consent') === 'on',
          turnstileToken: token || 'local-turnstile-pass',
          website: data.get('website') || ''
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setStatus(t.sent);
      form.reset();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t.error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">{t.name} *</label>
          <input id="name" name="name" required minLength={2} maxLength={60} />
        </div>
        <div className="field">
          <label htmlFor="email">{t.email} *</label>
          <input id="email" name="email" type="email" required maxLength={254} />
        </div>
        <div className="field">
          <label htmlFor="subject">{t.subject} *</label>
          <select id="subject" name="subject" defaultValue="question">
            <option value="question">{locale === 'fr' ? 'Question' : 'Question'}</option>
            <option value="testimonial">{locale === 'fr' ? 'Témoignage' : 'Testimonial'}</option>
            <option value="press">Presse / Press</option>
            <option value="partnership">
              {locale === 'fr' ? 'Association / partenariat' : 'Organisation / partnership'}
            </option>
            <option value="withdrawal">
              {locale === 'fr' ? 'Retrait de mes données' : 'Data withdrawal'}
            </option>
            <option value="other">{locale === 'fr' ? 'Autre' : 'Other'}</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="organization">{t.org}</label>
          <input id="organization" name="organization" maxLength={120} />
        </div>
        <div className="field full">
          <label htmlFor="message">{t.message} *</label>
          <textarea id="message" name="message" required minLength={20} maxLength={4000} rows={5} />
        </div>
      </div>
      <label className="check-row" style={{ margin: '14px 0' }}>
        <input name="consent" type="checkbox" required />
        <span>{t.consent}</span>
      </label>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Turnstile locale={locale} onToken={setToken} />
      {status && (
        <p className="status-message" role="status">
          {status}
        </p>
      )}
      <button className="primary-button" disabled={busy}>
        {busy ? (locale === 'fr' ? 'Envoi…' : 'Sending…') : t.send} ↗
      </button>
    </form>
  );
}
