import { ArrowUpRight, MailCheck, PenLine, Share2 } from 'lucide-react';
import { SiteShell } from '@/components/petition/SiteShell';
import { SignatureForm } from '@/components/petition/SignatureForm';
import { ShareButtons } from '@/components/petition/ShareButtons';
import { RegionalStats } from '@/components/petition/RegionalStats';
import { PublicSignatures } from '@/components/petition/PublicSignatures';
import { HeroStats } from '@/components/petition/HeroStats';
import { contextFacts, petition } from '@/content/petition';
import { type Locale } from '@/lib/constants';

export default async function PetitionPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ src?: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (raw === 'en' ? 'en' : 'fr') as Locale;
  const { src } = await searchParams;
  const validSrc = ['whatsapp', 'facebook', 'x', 'tiktok', 'direct', 'other'].includes(src || '')
    ? src!
    : null;
  const p = petition[locale];
  const fr = locale === 'fr';
  return (
    <SiteShell locale={locale}>
      <section className="hero-heading">
        <div>
          <span className="eyebrow">
            {fr ? 'Pétition citoyenne · Cameroun' : 'Citizens’ petition · Cameroon'}
          </span>
          <h1>{p.title}</h1>
        </div>
        <p className="hero-note">
          {fr
            ? 'Signez en une minute. Chaque signature est confirmée par e-mail et comptée une fois.'
            : 'Sign in one minute. Every signature is confirmed by email and counted once.'}
        </p>
      </section>
      <details className="petition-details">
        <summary>
          {fr ? 'Lire le texte complet de la pétition' : 'Read the full petition text'}
        </summary>
        <p>{p.intro}</p>
        <p>
          <strong>{fr ? 'Destinataires :' : 'Addressed to:'}</strong>{' '}
          {fr
            ? 'la Direction générale d’Orange Cameroun ; l’Agence de régulation des télécommunications (ART) ; le Ministère des Postes et Télécommunications (MINPOSTEL).'
            : 'the General Management of Orange Cameroon; the Telecommunications Regulatory Agency (ART); and the Ministry of Posts and Telecommunications (MINPOSTEL).'}
        </p>
        <p>{p.closing}</p>
      </details>
      <section className="sign-grid" aria-label={fr ? 'Signer la pétition' : 'Sign the petition'}>
        <SignatureForm locale={locale} source={validSrc} />
        <div
          className="art-card"
          aria-label={fr ? 'Illustration abstraite du réseau' : 'Abstract network illustration'}
        >
          <svg
            className="hero-art"
            viewBox="0 0 600 700"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#f7f7f7" />
                <stop offset="1" stopColor="#c9c9c9" />
              </linearGradient>
              <radialGradient id="r">
                <stop stopColor="#fff" stopOpacity=".95" />
                <stop offset="1" stopColor="#ddd" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="700" fill="url(#g)" />
            <circle cx="365" cy="260" r="260" fill="url(#r)" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <path
                key={i}
                d={`M ${-80 + i * 20} ${560 - i * 18} Q 250 ${220 - i * 20} ${680 - i * 15} ${110 + i * 30}`}
                fill="none"
                stroke="#111"
                strokeOpacity={0.12 - i * 0.009}
                strokeWidth="1.2"
              />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx={155 + i * 75}
                cy={350 - i * 36}
                r={5 + i}
                fill="#111"
                fillOpacity=".2"
              />
            ))}
            <path
              d="M305 365h2v90h-2zM294 387h24v2h-24zM286 413h40v2h-40zM279 438h54v2h-54z"
              fill="#111"
              opacity=".5"
            />
          </svg>
          <span className="art-label">{fr ? 'Notre voix' : 'Our voice'}</span>
          <HeroStats locale={locale} />
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">{fr ? 'Comment ça marche' : 'How it works'}</h2>
          <p>
            {fr
              ? 'Chaque étape protège l’intégrité du soutien exprimé.'
              : 'Each step helps protect the integrity of the support expressed.'}
          </p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-icon">
              <PenLine size={23} />
            </div>
            <div>
              <h3>{fr ? '1. Signez' : '1. Sign'}</h3>
              <p>
                {fr
                  ? 'Remplissez le formulaire en moins d’une minute.'
                  : 'Fill in the form in under a minute.'}
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-icon">
              <MailCheck size={23} />
            </div>
            <div>
              <h3>{fr ? '2. Confirmez' : '2. Confirm'}</h3>
              <p>
                {fr ? 'Cliquez sur le lien reçu par e-mail.' : 'Click the link sent to your email.'}
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-icon">
              <Share2 size={23} />
            </div>
            <div>
              <h3>{fr ? '3. Partagez' : '3. Share'}</h3>
              <p>
                {fr
                  ? 'Invitez trois proches à faire entendre leur voix.'
                  : 'Invite three people to add their voices.'}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section requests-panel">
        <div>
          <span className="eyebrow">{fr ? 'Nos demandes' : 'Our requests'}</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>
            {fr
              ? 'Un service à la hauteur de nos factures.'
              : 'Service that meets the price we pay.'}
          </h2>
          <p>
            {fr
              ? 'Nous demandons des engagements clairs, mesurables et accessibles au public.'
              : 'We are asking for clear, measurable commitments that the public can see.'}
          </p>
        </div>
        <div className="request-list">
          {p.requests.map((request, index) => (
            <div className="request-item" key={request}>
              <span className="request-number">{index + 1}</span>
              <span>{request}</span>
            </div>
          ))}
        </div>
      </section>
      <section id="contexte" className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">{fr ? 'Le contexte' : 'The facts'}</span>
            <h2 className="section-title" style={{ marginTop: 14 }}>
              {fr ? 'Des faits et leurs sources' : 'Facts with visible sources'}
            </h2>
          </div>
          <p>
            {fr
              ? 'Les informations ci-dessous proviennent des sources citées.'
              : 'The information below comes from the cited sources.'}
          </p>
        </div>
        <div className="facts-grid">
          {contextFacts.map((fact, index) => (
            <article className="fact-card" key={fact.source}>
              <p>{fact[locale]}</p>
              <a href={fact.source} target="_blank" rel="noopener noreferrer">
                {fr ? 'Source' : 'Source'} {index + 1} ↗
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">
              {fr ? 'Une voix par région' : 'A voice in every region'}
            </span>
            <h2 className="section-title" style={{ marginTop: 14 }}>
              {fr ? 'Soutiens par région' : 'Support by region'}
            </h2>
          </div>
          <p>
            {fr
              ? 'Les chiffres agrégés apparaissent à partir de 50 signatures vérifiées.'
              : 'Aggregated counts appear after 50 verified signatures.'}
          </p>
        </div>
        <RegionalStats locale={locale} />
      </section>
      <section className="section cta-panel">
        <div>
          <span className="eyebrow">{fr ? 'Agissez' : 'Take action'}</span>
          <h2 className="section-title" style={{ marginTop: 14 }}>
            {fr
              ? 'Chaque partage nous rapproche d’un service meilleur.'
              : 'Every share brings us closer to better service.'}
          </h2>
          <p>
            {fr
              ? 'Faites connaître cette initiative citoyenne autour de vous.'
              : 'Help more people learn about this citizens’ initiative.'}
          </p>
          <ShareButtons locale={locale} />
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="public-signatures">
            <h3>{fr ? 'Faites entendre votre voix' : 'Make your voice heard'}</h3>
            <p style={{ fontSize: 13, margin: '0 0 14px' }}>
              {fr
                ? 'Vos coordonnées restent privées. Seuls votre prénom et votre ville peuvent être affichés, avec votre accord explicite.'
                : 'Your details stay private. Only your first name and city may be shown, with your explicit consent.'}
            </p>
            <a className="share-button primary" href="#top">
              {fr ? 'Signer la pétition' : 'Sign the petition'} <ArrowUpRight size={15} />
            </a>
          </div>
          <PublicSignatures locale={locale} />
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">
            {fr ? 'Questions fréquentes' : 'Frequently asked questions'}
          </h2>
        </div>
        <div className="faq-list">
          {(fr
            ? [
                [
                  'Qui peut signer ?',
                  'Toute personne souhaitant soutenir ces demandes peut signer la pétition.'
                ],
                [
                  'Pourquoi confirmer mon e-mail ?',
                  'La confirmation permet de vérifier chaque signature et d’éviter les doublons.'
                ],
                [
                  'Mes données sont-elles publiques ?',
                  'Non. Seuls le prénom et la ville peuvent apparaître, si vous cochez la case dédiée.'
                ],
                [
                  'Comment retirer ma signature ?',
                  'Demandez un lien de retrait sur la page « Retirer ma signature ».'
                ]
              ]
            : [
                ['Who can sign?', 'Anyone who supports these requests can sign the petition.'],
                [
                  'Why confirm my email?',
                  'Confirmation helps verify each signature and prevent duplicates.'
                ],
                [
                  'Is my information public?',
                  'No. Only your first name and city may appear if you select the optional consent.'
                ],
                [
                  'How can I withdraw my signature?',
                  'Request a removal link from the withdrawal page.'
                ]
              ]
          ).map(([q, a]) => (
            <details className="faq-item" key={q}>
              <summary>
                {q}
                <span aria-hidden="true">＋</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
