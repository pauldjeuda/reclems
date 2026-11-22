'use client';
import { useState } from 'react';
import type { Locale } from '@/lib/constants';
export function ShareButtons({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${locale}`;
  const message =
    locale === 'fr'
      ? 'Signez cette pétition citoyenne pour un service télécom à la hauteur au Cameroun.'
      : 'Sign this citizens’ petition for quality telecom service in Cameroon.';
  const tracked = (src: string) => `${url}?src=${src}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };
  const share = async () => {
    if ('share' in navigator) await navigator.share({ title: message, url });
    else await copy();
  };
  return (
    <div className="share-row">
      <a
        className="share-button primary"
        href={`https://wa.me/?text=${encodeURIComponent(`${message} ${tracked('whatsapp')}`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp ↗
      </a>
      <a
        className="share-button"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tracked('facebook'))}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Facebook
      </a>
      <a
        className="share-button"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(tracked('x'))}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <button className="share-button" onClick={copy}>
        {copied
          ? locale === 'fr'
            ? 'Lien copié'
            : 'Link copied'
          : locale === 'fr'
            ? 'Copier le lien'
            : 'Copy link'}
      </button>
      <button className="share-button" onClick={share}>
        {locale === 'fr' ? 'Partager…' : 'Share…'}
      </button>
    </div>
  );
}
