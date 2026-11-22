'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { REGIONS, type Locale } from '@/lib/constants';
import { Turnstile } from './Turnstile';

const labels = {
  fr: {
    first: 'Prénom',
    last: 'Nom',
    email: 'E-mail',
    region: 'Région',
    city: 'Ville (facultatif)',
    terms: 'J’accepte que mes données soient traitées pour cette pétition.',
    updates: 'Je souhaite recevoir des nouvelles de la pétition',
    public: 'J’accepte que mon prénom et ma ville apparaissent publiquement',
    submit: 'Signer la pétition',
    pending: 'Vérifiez votre boîte e-mail',
    sent: 'Si votre adresse est valide, un e-mail de confirmation a été envoyé.',
    help: 'Regardez aussi dans vos courriers indésirables. Le message peut prendre quelques minutes.',
    change: 'Changer d’adresse'
  },
  en: {
    first: 'First name',
    last: 'Last name',
    email: 'Email',
    region: 'Region',
    city: 'City (optional)',
    terms: 'I agree to the processing of my data for this petition.',
    updates: 'I would like to receive petition updates',
    public: 'I agree to show my first name and city publicly',
    submit: 'Sign the petition',
    pending: 'Check your email',
    sent: 'If your address is valid, a confirmation email has been sent.',
    help: 'Also check your spam folder. The message may take a few minutes.',
    change: 'Use another address'
  }
} as const;

export function SignatureForm({ locale, source }: { locale: Locale; source: string | null }) {
  const t = labels[locale];
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [stats, setStats] = useState<{ total: number; goal: number; isOpen: boolean } | null>(null);
  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats({ total: data.total, goal: data.goal, isOpen: data.isOpen }))
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    if (!done || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [done, countdown]);
  async function resend() {
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/sign/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale, turnstileToken: token || 'local-turnstile-pass' })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setError(data.message);
      setCountdown(60);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : locale === 'fr'
            ? 'Réessai impossible.'
            : 'Unable to resend.'
      );
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      region: data.get('region'),
      city: data.get('city') || null,
      locale,
      consentTerms: data.get('consentTerms') === 'on',
      consentUpdates: data.get('consentUpdates') === 'on',
      publicDisplay: data.get('publicDisplay') === 'on',
      src: source,
      turnstileToken: token || 'local-turnstile-pass',
      website: data.get('website') || ''
    };
    if (!payload.consentTerms) {
      setError(locale === 'fr' ? 'Le consentement est obligatoire.' : 'Consent is required.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Request failed');
      setEmail(String(payload.email));
      setDone(true);
      setCountdown(60);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : locale === 'fr'
            ? 'Erreur réseau. Réessayez.'
            : 'Network error. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }
  if (stats?.isOpen === false)
    return (
      <div className="form-card">
        <span className="eyebrow">{locale === 'fr' ? 'Pétition clôturée' : 'Petition closed'}</span>
        <h2>{locale === 'fr' ? 'Cette pétition est clôturée.' : 'This petition is closed.'}</h2>
        <p>
          {locale === 'fr' ? 'Merci à nos' : 'Thank you to our'}{' '}
          <strong>
            {new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en').format(stats.total)}
          </strong>{' '}
          {locale === 'fr' ? 'signataires.' : 'signatories.'}
        </p>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, (stats.total / Math.max(1, stats.goal)) * 100)}%` }}
          />
        </div>
      </div>
    );
  if (done)
    return (
      <div className="form-card" role="status">
        <div className="success-mark">
          <Check size={26} />
        </div>
        <h2>{t.pending}</h2>
        <p>{t.sent}</p>
        <p className="form-lead">
          {email.replace(/^(.).+(@.+)$/, '$1***$2')}
          <br />
          {t.help}
        </p>
        {error && <p className="form-lead">{error}</p>}
        <button className="share-button" disabled={busy || countdown > 0} onClick={resend}>
          {locale === 'fr' ? 'Renvoyer l’e-mail' : 'Resend email'}
          {countdown > 0 ? ` (${countdown}s)` : ''}
        </button>
        <button
          className="share-button"
          style={{ marginLeft: 8 }}
          onClick={() => {
            formRef.current?.reset();
            setEmail('');
            setDone(false);
            setError('');
          }}
        >
          {t.change}
        </button>
      </div>
    );
  return (
    <form ref={formRef} className="form-card" onSubmit={submit} noValidate>
      <div className="eyebrow">
        {locale === 'fr' ? 'Une signature, une voix' : 'One signature, one voice'}
      </div>
      <h2>{locale === 'fr' ? 'Signez la pétition' : 'Sign the petition'}</h2>
      <p className="form-lead">
        {locale === 'fr'
          ? 'Chaque signature est confirmée par e-mail et comptée une fois.'
          : 'Every signature is confirmed by email and counted once.'}
      </p>
      <div className="stats-chip">
        <div>
          <strong>
            {stats
              ? new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en').format(stats.total)
              : '…'}
          </strong>
          <br />
          <span>{locale === 'fr' ? 'signatures vérifiées' : 'verified signatures'}</span>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={
              stats ? Math.min(100, Math.round((stats.total / Math.max(1, stats.goal)) * 100)) : 0
            }
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill"
              style={{
                width: `${stats ? Math.min(100, (stats.total / Math.max(1, stats.goal)) * 100) : 0}%`
              }}
            />
          </div>
        </div>
        <a href="#contexte" className="share-button">
          {locale === 'fr' ? 'Voir les faits' : 'See the facts'}
        </a>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="firstName">{t.first} *</label>
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            minLength={2}
            maxLength={60}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="lastName">{t.last} *</label>
          <input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            minLength={2}
            maxLength={60}
            required
          />
        </div>
        <div className="field full">
          <label htmlFor="email">{t.email} *</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="region">{t.region} *</label>
          <select id="region" name="region" required defaultValue="">
            <option value="" disabled>
              {locale === 'fr' ? 'Choisir…' : 'Choose…'}
            </option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {locale === 'en' && region === 'Hors du Cameroun (diaspora)'
                  ? 'Outside Cameroon (diaspora)'
                  : region}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="city">{t.city}</label>
          <input id="city" name="city" autoComplete="address-level2" maxLength={60} />
        </div>
      </div>
      <div className="checks">
        <label className="check-row">
          <input name="consentTerms" type="checkbox" required />
          <span>
            {t.terms} (
            <a href={`/${locale}/confidentialite`}>
              {locale === 'fr' ? 'confidentialité' : 'privacy policy'}
            </a>
            ) *
          </span>
        </label>
        <label className="check-row">
          <input name="consentUpdates" type="checkbox" />
          <span>{t.updates}</span>
        </label>
        <label className="check-row">
          <input name="publicDisplay" type="checkbox" />
          <span>{t.public}</span>
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Turnstile locale={locale} onToken={setToken} />
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <div className="primary-wrap">
        <button className="primary-button" type="submit" disabled={busy}>
          {busy ? (locale === 'fr' ? 'Envoi…' : 'Sending…') : t.submit}
        </button>
        <span className="button-arrow" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <p className="form-lead">
        {locale === 'fr'
          ? 'Aucune donnée personnelle ne sera transmise avec le bilan de la pétition.'
          : 'No personal data will be shared with the petition report.'}
      </p>
    </form>
  );
}
