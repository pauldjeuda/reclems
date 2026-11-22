import { headers } from 'next/headers';
import { SiteShell } from '@/components/petition/SiteShell';
export default async function LocaleNotFound() {
  const locale = (await headers()).get('x-app-locale') === 'en' ? 'en' : 'fr';
  const fr = locale !== 'en';
  return (
    <SiteShell locale={fr ? 'fr' : 'en'}>
      <section className="flow-card center">
        <h1 style={{ fontSize: 100, color: 'var(--ink-3)' }}>404</h1>
        <p>{fr ? 'Cette page est introuvable.' : 'This page could not be found.'}</p>
        <a className="primary-button" href={`/${fr ? 'fr' : 'en'}`}>
          {fr ? 'Retour à l’accueil' : 'Back home'} ↗
        </a>
      </section>
    </SiteShell>
  );
}
