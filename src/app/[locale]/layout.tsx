import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { type Locale } from '@/lib/constants';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const english = locale === 'en';
  return {
    title: {
      default: english
        ? 'Orange Cameroon: service that meets the price'
        : 'Orange Cameroun : un service à la hauteur',
      template: '%s | Initiative citoyenne'
    },
    description: english
      ? 'Sign the citizens’ petition for quality telecom service in Cameroon.'
      : 'Signez la pétition citoyenne pour un service télécom de qualité au Cameroun.',
    robots: { index: true, follow: true },
    alternates: { languages: { fr: '/fr', en: '/en' } },
    openGraph: { type: 'website', siteName: 'Initiative citoyenne', images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image' }
  };
}
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  if (!hasLocale(routing.locales, requested)) notFound();
  const locale = requested as Locale;
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
