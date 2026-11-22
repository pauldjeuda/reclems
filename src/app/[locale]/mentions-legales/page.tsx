import { SiteShell } from '@/components/petition/SiteShell';
import type { Locale } from '@/lib/constants';
export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'en' ? 'en' : 'fr') as Locale;
  const fr = locale === 'fr';
  const review = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview';
  return (
    <SiteShell locale={locale}>
      <article className="subpage">
        <span className="eyebrow">{fr ? 'Informations légales' : 'Legal information'}</span>
        <h1>{fr ? 'Mentions légales' : 'Legal notice'}</h1>
        {review && (
          <div className="review-banner">
            {fr
              ? 'Texte à faire relire par un juriste avant publication'
              : 'This text must be reviewed by a lawyer before publication'}
          </div>
        )}
        <h2>{fr ? 'Éditeur' : 'Publisher'}</h2>
        <p>
          [NOM / ASSOCIATION / ADRESSE]
          <br />
          {fr ? 'Directeur de publication' : 'Publication director'} : [NOM]
          <br />
          {fr ? 'Contact' : 'Contact'} : [CONTACT_EMAIL]
        </p>
        <h2>{fr ? 'Hébergement' : 'Hosting'}</h2>
        <p>
          Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA. Google Firebase héberge la
          base de données dans la région [RÉGION FIRESTORE À CONFIRMER].
        </p>
        <h2>
          {fr
            ? 'Propriété intellectuelle et indépendance'
            : 'Intellectual property and independence'}
        </h2>
        <p>
          {fr
            ? 'Cette initiative n’est affiliée ni à Orange ni à un opérateur. Orange est une marque de ses propriétaires.'
            : 'This initiative is not affiliated with Orange or any operator. Orange is a trademark of its owners.'}
        </p>
      </article>
    </SiteShell>
  );
}
