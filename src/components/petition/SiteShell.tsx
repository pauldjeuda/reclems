import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/constants';

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const fr = locale === 'fr';
  return (
    <div className="page-wrap">
      <main id="top" className="main-card">
        <div className="container">
          <header className="site-header">
            <Link className="wordmark" href={`/${locale}`}>
              <span className="signal-mark" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              Initiative citoyenne
            </Link>
            <span className="header-note">
              {fr
                ? 'Cameroun · Initiative citoyenne indépendante'
                : 'Cameroon · Independent citizens’ initiative'}
            </span>
            <nav
              className="nav-links"
              aria-label={fr ? 'Navigation principale' : 'Main navigation'}
            >
              <Link href={`/${locale}#contexte`}>{fr ? 'Le contexte' : 'The facts'}</Link>
              <Link href={`/${locale}/a-propos`}>{fr ? 'À propos' : 'About'}</Link>
              <Link href={`/${locale}/contact`}>{fr ? 'Contact' : 'Contact'}</Link>
              <span className="locale-switch">
                <Link className={fr ? 'active' : ''} href={hrefFor(locale, 'fr')}>
                  FR
                </Link>
                <Link className={!fr ? 'active' : ''} href={hrefFor(locale, 'en')}>
                  EN
                </Link>
              </span>
            </nav>
          </header>
          {children}
          <footer className="site-footer">
            <div className="footer-links">
              <Link href={`/${locale}/a-propos`}>{fr ? 'À propos' : 'About'}</Link>
              <Link href={`/${locale}/confidentialite`}>{fr ? 'Confidentialité' : 'Privacy'}</Link>
              <Link href={`/${locale}/mentions-legales`}>
                {fr ? 'Mentions légales' : 'Legal notice'}
              </Link>
              <Link href={`/${locale}/retrait`}>
                {fr ? 'Retirer ma signature' : 'Withdraw signature'}
              </Link>
            </div>
            <span>
              {fr
                ? 'Initiative citoyenne indépendante, non affiliée à Orange ni à un opérateur. Orange est une marque de ses propriétaires.'
                : 'Independent citizens’ initiative, not affiliated with Orange or any operator. Orange is a trademark of its owners.'}
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
function hrefFor(_current: Locale, next: Locale) {
  return `/${next}`;
}
