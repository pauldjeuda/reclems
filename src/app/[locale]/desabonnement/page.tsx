import type { Metadata } from 'next';
import { SiteShell } from '@/components/petition/SiteShell';
import { UnsubscribeAction } from '@/components/petition/UnsubscribeAction';
import type { Locale } from '@/lib/constants';
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function UnsubscribePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string; sig?: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (raw === 'en' ? 'en' : 'fr') as Locale;
  const query = await searchParams;
  return (
    <SiteShell locale={locale}>
      <section className="flow-card center">
        <h1>{locale === 'fr' ? 'Désabonnement' : 'Unsubscribe'}</h1>
        <p>
          {locale === 'fr'
            ? 'Confirmez le désabonnement aux actualités de la pétition.'
            : 'Confirm that you want to stop receiving petition updates.'}
        </p>
        <UnsubscribeAction id={query.id || ''} sig={query.sig || ''} locale={locale} />
      </section>
    </SiteShell>
  );
}
