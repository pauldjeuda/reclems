import { SiteShell } from '@/components/petition/SiteShell';
import { ContactForm } from '@/components/petition/ContactForm';
import { ShareButtons } from '@/components/petition/ShareButtons';
import type { Locale } from '@/lib/constants';
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'en' ? 'en' : 'fr') as Locale;
  const fr = locale === 'fr';
  return (
    <SiteShell locale={locale}>
      <article className="subpage" style={{ maxWidth: 1050 }}>
        <div className="hero-heading">
          <div>
            <span className="eyebrow">Contact</span>
            <h1>{fr ? 'Nous contacter' : 'Contact us'}</h1>
          </div>
          <p className="hero-note">
            {fr
              ? 'Une question, un témoignage ou une demande presse ?'
              : 'A question, a story or a press enquiry?'}
          </p>
        </div>
        <div className="contact-grid">
          <ContactForm locale={locale} />
          <aside className="contact-info">
            <div className="art-card" style={{ minHeight: 270 }}>
              <svg className="hero-art" viewBox="0 0 300 360" aria-hidden="true">
                <rect width="300" height="360" fill="#e5e5e5" />
                <path
                  d="M-20 300 Q100 120 330 55 M-10 330 Q120 170 320 105 M10 350 Q140 215 320 155"
                  fill="none"
                  stroke="#222"
                  strokeOpacity=".2"
                  strokeWidth="2"
                />
              </svg>
              <span className="art-label">{fr ? 'Votre voix' : 'Your voice'}</span>
            </div>
            <div className="info-box">
              <strong>WhatsApp</strong>
              <span>[NUMÉRO]</span>
            </div>
            <div className="info-box">
              <strong>{fr ? 'Délai de réponse' : 'Response time'}</strong>
              <span>[DÉLAI]</span>
            </div>
            <div className="info-box">
              <strong>{fr ? 'Écrire' : 'Email'}</strong>
              <span>[CONTACT_EMAIL] · [PRESSE_EMAIL]</span>
            </div>
          </aside>
        </div>
        <section className="section-card" style={{ marginTop: 28 }}>
          <h2 className="section-title">{fr ? 'Soutenez la pétition' : 'Support the petition'}</h2>
          <p>{fr ? 'Partagez cette initiative citoyenne.' : 'Share this citizens’ initiative.'}</p>
          <ShareButtons locale={locale} />
        </section>
      </article>
    </SiteShell>
  );
}
