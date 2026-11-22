import type { Metadata } from 'next';
import { SiteShell } from '@/components/petition/SiteShell';
import { WithdrawForm } from '@/components/petition/WithdrawForm';
import type { Locale } from '@/lib/constants';
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function WithdrawPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (raw === 'en' ? 'en' : 'fr') as Locale;
  return (
    <SiteShell locale={locale}>
      <section className="flow-card">
        <span className="eyebrow">
          {locale === 'fr' ? 'Droit à l’effacement' : 'Right to erasure'}
        </span>
        <h1>{locale === 'fr' ? 'Retirer ma signature' : 'Withdraw my signature'}</h1>
        <p>
          {locale === 'fr'
            ? 'Entrez l’adresse utilisée pour signer. Si une signature correspond, un lien de confirmation vous sera envoyé.'
            : 'Enter the email used to sign. If a signature matches, we will send a confirmation link.'}
        </p>
        <WithdrawForm locale={locale} />
      </section>
    </SiteShell>
  );
}
