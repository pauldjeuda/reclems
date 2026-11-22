'use client';
export default function LocaleError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-wrap">
      <section className="main-card flow-card center">
        <h1 style={{ fontSize: 100, color: 'var(--ink-3)' }}>500</h1>
        <p>Une erreur est survenue. / Something went wrong.</p>
        <button className="primary-button" onClick={() => reset()}>
          Réessayer / Try again
        </button>
      </section>
    </main>
  );
}
