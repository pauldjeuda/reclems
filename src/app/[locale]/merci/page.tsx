import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { SiteShell } from '@/components/petition/SiteShell';
import { ShareButtons } from '@/components/petition/ShareButtons';
import type { Locale } from '@/lib/constants';
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function ThanksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'en' ? 'en' : 'fr') as Locale;
  return (
    <SiteShell locale={locale}>
      <section className="flow-card center">
        <div className="success-mark">
          <Check size={28} />
        </div>
        <h1>
          {locale === 'fr'
            ? 'Merci, votre signature est confirmée'
            : 'Thank you, your signature is confirmed'}
        </h1>
        <p>
          {locale === 'fr'
            ? 'Invitez 3 personnes aujourd’hui à signer cette pétition.'
            : 'Invite three people today to sign this petition.'}
        </p>
        <ShareButtons locale={locale} />
        <p style={{ marginTop: 22, fontSize: 12 }}>
          <a href={`/${locale}/retrait`}>
            {locale === 'fr' ? 'Retirer ma signature' : 'Withdraw my signature'}
          </a>
        </p>
      </section>
    </SiteShell>
  );
}
