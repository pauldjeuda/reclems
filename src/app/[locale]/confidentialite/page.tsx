import type { Metadata } from 'next';
import { SiteShell } from '@/components/petition/SiteShell';
import type { Locale } from '@/lib/constants';
export const metadata: Metadata = { robots: { index: true, follow: true } };
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'en' ? 'en' : 'fr') as Locale;
  const fr = locale === 'fr';
  const review = process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview';
  return (
    <SiteShell locale={locale}>
      <article className="subpage">
        <span className="eyebrow">{fr ? 'Confidentialité' : 'Privacy'}</span>
        <h1>{fr ? 'Politique de confidentialité' : 'Privacy policy'}</h1>
        {review && (
          <div className="review-banner">
            {fr
              ? 'Texte à faire relire par un juriste avant publication'
              : 'This text must be reviewed by a lawyer before publication'}
          </div>
        )}
        <p>
          {fr
            ? 'Responsable du traitement : [NOM / ASSOCIATION / ADRESSE], contact [CONTACT_EMAIL].'
            : 'Data controller: [NAME / ORGANIZATION / ADDRESS], contact [CONTACT_EMAIL].'}
        </p>
        <h2>{fr ? 'Finalités et base' : 'Purpose and legal basis'}</h2>
        <p>
          {fr
            ? 'Les données servent à recueillir et dénombrer les soutiens à la pétition, établir un bilan agrégé pour les destinataires et informer les personnes qui le demandent. Le traitement repose sur votre consentement.'
            : 'Data is used to collect and count support for the petition, prepare an aggregated report for its recipients and send updates to people who request them. Processing is based on your consent.'}
        </p>
        <h2>{fr ? 'Données collectées' : 'Data collected'}</h2>
        <p>
          {fr
            ? 'Prénom, nom, e-mail, région, ville facultative, choix de consentement, empreinte HMAC irréversible de l’adresse IP et dates liées à la signature. Les messages du formulaire de contact sont envoyés par e-mail et ne sont pas stockés dans la base.'
            : 'First and last name, email, region, optional city, consent choices, an irreversible HMAC fingerprint of the IP address and signature timestamps. Contact form messages are emailed and not stored in the database.'}
        </p>
        <h2>{fr ? 'Affichage et partage' : 'Public display and sharing'}</h2>
        <p>
          {fr
            ? 'Seuls le prénom et la ville peuvent être publiés, et uniquement si vous cochez la case facultative correspondante. Le bilan transmis aux destinataires est agrégé et ne contient pas de données personnelles.'
            : 'Only your first name and city may be displayed, and only if you select the optional consent. The report shared with recipients is aggregated and contains no personal data.'}
        </p>
        <h2>{fr ? 'Destinataires et sous-traitants' : 'Recipients and processors'}</h2>
        <p>
          {fr
            ? 'Google Firebase (base de données et authentification administrateur), Vercel (hébergement), [Brevo ou Resend] (e-mails), Cloudflare (anti-robots) et Upstash (limitation de débit). Ces fournisseurs peuvent traiter des données hors du Cameroun. Région Firestore : [RÉGION À CONFIRMER].'
            : 'Google Firebase (database and admin authentication), Vercel (hosting), [Brevo or Resend] (email), Cloudflare (bot protection) and Upstash (rate limiting). These providers may process data outside Cameroon. Firestore region: [REGION TO CONFIRM].'}
        </p>
        <h2>{fr ? 'Conservation' : 'Retention'}</h2>
        <p>
          {fr
            ? 'Les signatures non confirmées sont supprimées sous 7 jours. Les signatures confirmées sont conservées [DURÉE À DÉCIDER] ou jusqu’au retrait.'
            : 'Unconfirmed signatures are deleted within 7 days. Confirmed signatures are retained for [RETENTION PERIOD TO DECIDE] or until withdrawn.'}
        </p>
        <h2>{fr ? 'Vos droits' : 'Your rights'}</h2>
        <p>
          {fr
            ? 'Vous pouvez demander l’accès, la rectification, l’effacement ou vous opposer au traitement en écrivant à [CONTACT_EMAIL]. Pour retirer une signature, utilisez le formulaire de retrait. La loi n° 2024/017 du 23 décembre 2024 relative à la protection des données à caractère personnel au Cameroun est applicable depuis le 23 juin 2026. Le nom et les modalités de saisine de l’autorité compétente restent à confirmer.'
            : 'You may request access, correction or erasure, or object to processing by contacting [CONTACT_EMAIL]. Use the withdrawal form to remove a signature. Cameroon Law No. 2024/017 of 23 December 2024 on personal data protection has applied since 23 June 2026. The name and contact details of the competent authority must be confirmed.'}
        </p>
        <p>
          <a
            href="https://www.prc.cm/fr/actualites/actes/lois/7588"
            target="_blank"
            rel="noopener noreferrer"
          >
            {fr ? 'Texte officiel de la loi n° 2024/017' : 'Official text of Law No. 2024/017'}
          </a>
        </p>
      </article>
    </SiteShell>
  );
}
