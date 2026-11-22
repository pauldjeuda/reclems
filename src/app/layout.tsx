import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Initiative citoyenne — qualité des télécommunications',
    template: '%s | Initiative citoyenne'
  },
  description: 'Une pétition citoyenne pour un service télécom de qualité au Cameroun.',
  icons: { icon: '/icon.svg', apple: '/apple-touch-icon.png' },
  manifest: '/manifest.webmanifest'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get('x-app-locale') === 'en' ? 'en' : 'fr';
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
