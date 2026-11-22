import type { Metadata } from 'next';
import { SiteShell } from '@/components/petition/SiteShell';
import { WithdrawConfirmAction } from '@/components/petition/WithdrawConfirmAction';
import type { Locale } from '@/lib/constants';
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function WithdrawConfirmPage({
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
        <span className="eyebrow">
          {locale === 'fr' ? 'Retrait de signature' : 'Signature withdrawal'}
        </span>
        <h1>{locale === 'fr' ? 'Confirmer la suppression' : 'Confirm deletion'}</h1>
        <p>
          {locale === 'fr'
            ? 'Cette action supprime définitivement votre signature.'
            : 'This action permanently deletes your signature.'}
        </p>
        {query.id && query.token ? (
          <WithdrawConfirmAction id={query.id} token={query.token} locale={locale} />
        ) : (
          <p className="error-message">
            {locale === 'fr' ? 'Lien invalide ou expiré.' : 'Invalid or expired link.'}
          </p>
        )}
      </section>
    </SiteShell>
  );
}
