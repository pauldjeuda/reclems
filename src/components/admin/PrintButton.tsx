'use client';
export function PrintButton() {
  return (
    <button className="primary-button" onClick={() => window.print()}>
      Imprimer / télécharger en PDF ↗
    </button>
  );
}
