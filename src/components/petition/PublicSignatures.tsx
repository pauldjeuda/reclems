'use client';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/constants';
export function PublicSignatures({ locale }: { locale: Locale }) {
  const [names, setNames] = useState<{ firstName: string; city: string }[]>([]);
  useEffect(() => {
    fetch('/api/public-signatures')
      .then((r) => r.json())
      .then((d) => setNames(d.signatures))
      .catch(() => undefined);
  }, []);
  if (!names.length) return null;
  return (
    <div className="public-signatures">
      <h3>{locale === 'fr' ? 'Dernières signatures publiques' : 'Recent public signatures'}</h3>
      <div className="signature-list">
        {names.map((person, index) => (
          <div key={`${person.firstName}-${index}`} className="signature-row">
            <span>{person.firstName}</span>
            <span>{person.city}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
