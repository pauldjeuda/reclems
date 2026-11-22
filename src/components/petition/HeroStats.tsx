'use client';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/constants';
export function HeroStats({ locale }: { locale: Locale }) {
  const [stats, setStats] = useState<{ total: number; goal: number } | null>(null);
  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => setStats({ total: d.total, goal: d.goal }))
      .catch(() => undefined);
  }, []);
  const total = stats?.total || 0;
  const goal = stats?.goal || 10000;
  return (
    <div className="art-stats">
      <strong>
        {stats ? new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en').format(total) : '…'}
      </strong>
      <span>{locale === 'fr' ? 'signatures vérifiées' : 'verified signatures'}</span>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={Math.min(100, Math.round((total / Math.max(1, goal)) * 100))}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ marginTop: 10 }}
      >
        <div
          className="progress-fill"
          style={{ width: `${Math.min(100, (total / Math.max(1, goal)) * 100)}%` }}
        />
      </div>
    </div>
  );
}
