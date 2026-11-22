import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api',
        '/fr/verify',
        '/en/verify',
        '/fr/merci',
        '/en/merci',
        '/fr/retrait',
        '/en/retrait',
        '/fr/desabonnement',
        '/en/desabonnement'
      ]
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sitemap.xml`
  };
}
