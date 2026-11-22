import { SiteShell } from '@/components/petition/SiteShell';
import type { Locale } from '@/lib/constants';
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'en' ? 'en' : 'fr') as Locale;
  const fr = locale === 'fr';
  return (
    <SiteShell locale={locale}>
      <article className="subpage">
        <span className="eyebrow">{fr ? 'À propos' : 'About'}</span>
        <h1>
          {fr ? 'Une initiative citoyenne indépendante' : 'An independent citizens’ initiative'}
        </h1>
        <p>
          {fr ? 'Cette pétition est portée par ' : 'This petition is organized by '}
          <strong>[NOM / ASSOCIATION]</strong>.{' '}
          {fr
            ? 'Le collectif déclare être sans lien avec un opérateur concurrent ni avec un parti politique ; cette déclaration reste à confirmer avant publication.'
            : 'The organizers state they have no link to a competing operator or political party; this statement must be confirmed before publication.'}
        </p>
        <h2>{fr ? 'À qui s’adresse la pétition ?' : 'Who is the petition addressed to?'}</h2>
        <p>
          {fr
            ? 'À la Direction générale d’Orange Cameroun, à l’Agence de régulation des télécommunications (ART) et au Ministère des Postes et Télécommunications (MINPOSTEL).'
            : 'To Orange Cameroon’s General Management, the Telecommunications Regulatory Agency (ART) and the Ministry of Posts and Telecommunications (MINPOSTEL).'}
        </p>
        <h2>{fr ? 'Ce que nous ferons des signatures' : 'How signatures will be used'}</h2>
        <p>
          {fr
            ? 'Les signatures vérifiées serviront à établir un bilan agrégé remis aux destinataires. Aucune donnée personnelle ne sera transmise avec ce bilan.'
            : 'Verified signatures will be used to create an aggregated report for the recipients. No personal data will be shared with that report.'}
        </p>
        <h2>{fr ? 'Sources' : 'Sources'}</h2>
        <ul>
          <li>
            <a href="https://itweb.africa/article/cameroon-sanction-telcos-over-quality-of-service/RgeVDMPRLjPvKJN3">
              ITWeb Africa — sanctions de juillet 2025
            </a>
          </li>
          <li>
            <a href="https://www.wearetech.africa/en/fils-uk/news/telecom/cameroon-orange-pledges-network-improvements-after-regulator-flags-10-million-in-violations">
              We Are Tech — mise à jour 2026
            </a>
          </li>
          <li>
            <a href="https://osiris.sn/cameroun-malgre-les-sanctions-la-qualite-des-reseaux-mobiles-reste-contestee.html">
              OSIRIS — qualité des réseaux
            </a>
          </li>
        </ul>
        <h2>{fr ? 'Contact' : 'Contact'}</h2>
        <p>
          <a href="mailto:[CONTACT_EMAIL]">[CONTACT_EMAIL]</a>
        </p>
        <h2>{fr ? 'Questions fréquentes' : 'Frequently asked questions'}</h2>
        <p>
          <strong>{fr ? 'Qui peut signer ?' : 'Who can sign?'}</strong>{' '}
          {fr
            ? 'Toute personne souhaitant soutenir ces demandes.'
            : 'Anyone who supports the requests.'}
        </p>
        <p>
          <strong>{fr ? 'Pourquoi confirmer mon e-mail ?' : 'Why confirm my email?'}</strong>{' '}
          {fr
            ? 'Pour vérifier les signatures et limiter les doublons.'
            : 'To verify signatures and reduce duplicates.'}
        </p>
        <p>
          <strong>{fr ? 'Mes données sont-elles publiques ?' : 'Is my information public?'}</strong>{' '}
          {fr
            ? 'Non, sauf votre prénom et votre ville si vous donnez votre accord facultatif.'
            : 'No, except for your first name and city if you give optional consent.'}
        </p>
        <p>
          <strong>
            {fr ? 'Comment retirer ma signature ?' : 'How do I withdraw my signature?'}
          </strong>{' '}
          {fr
            ? 'Demandez un lien sur la page de retrait.'
            : 'Request a link from the withdrawal page.'}
        </p>
      </article>
    </SiteShell>
  );
}
