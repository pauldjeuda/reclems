import type { Metadata } from 'next';
import { SiteShell } from '@/components/petition/SiteShell';
import { VerifyAction } from '@/components/petition/VerifyAction';
import type { Locale } from '@/lib/constants';
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function VerifyPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string; token?: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (raw === 'en' ? 'en' : 'fr') as Locale;
  const query = await searchParams;
  return (
    <SiteShell locale={locale}>
      <section className="flow-card center">
        <span className="eyebrow">{locale === 'fr' ? 'Vérification' : 'Verification'}</span>
        <h1>{locale === 'fr' ? 'Confirmez votre signature' : 'Confirm your signature'}</h1>
        <p>
          {locale === 'fr'
            ? 'Un clic sur ce bouton confirmera la signature.'
            : 'Click the button to confirm your signature.'}
        </p>
        {query.id && query.token ? (
          <VerifyAction id={query.id} token={query.token} locale={locale} />
        ) : (
          <p className="error-message">
            {locale === 'fr' ? 'Lien invalide ou incomplet.' : 'Invalid or incomplete link.'}
          </p>
        )}
      </section>
    </SiteShell>
  );
}
