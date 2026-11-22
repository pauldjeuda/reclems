'use client';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/constants';
type Stats = { total: number; goal: number; byRegion: Record<string, number> };
export function RegionalStats({ locale }: { locale: Locale }) {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => undefined);
  }, []);
  if (!stats || stats.total < 50) return null;
  const max = Math.max(1, ...Object.values(stats.byRegion));
  return (
    <div className="region-list">
      {Object.entries(stats.byRegion).map(([region, count]) => (
        <div className="region-row" key={region}>
          <span>
            {locale === 'en' && region === 'Hors du Cameroun (diaspora)'
              ? 'Outside Cameroon'
              : region}
          </span>
          <div className="region-track">
            <i style={{ width: `${(count / max) * 100}%` }} />
          </div>
          <span>{new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en').format(count)}</span>
        </div>
      ))}
    </div>
  );
}
