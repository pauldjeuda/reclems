'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        target: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback': () => void;
          theme?: string;
        }
      ) => string;
      remove: (id: string) => void;
    };
  }
}

export function Turnstile({
  onToken,
  locale
}: {
  onToken: (token: string) => void;
  locale: 'fr' | 'en';
}) {
  const node = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      onToken('local-turnstile-pass');
      return;
    }
    const mount = () => {
      if (!node.current || !window.turnstile) return;
      const id = window.turnstile.render(node.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
        callback: onToken,
        'expired-callback': () => onToken('')
      });
      return id;
    };
    let widgetId: string | undefined;
    if (window.turnstile) widgetId = mount();
    else {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        widgetId = mount();
      };
      document.head.appendChild(script);
    }
    return () => {
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [onToken]);
  return (
    <div
      className="turnstile-slot"
      aria-label={locale === 'fr' ? 'Vérification anti-robot' : 'Anti-bot verification'}
    >
      <div ref={node} />
    </div>
  );
}
