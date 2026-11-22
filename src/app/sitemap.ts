import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const routes = ['', 'a-propos', 'contact', 'confidentialite', 'mentions-legales'];
  return ['fr', 'en'].flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route ? `/${route}` : ''}`,
      lastModified: new Date(),
      changeFrequency: route ? 'monthly' : ('weekly' as const),
      priority: route ? 0.6 : 1
    }))
  );
}
