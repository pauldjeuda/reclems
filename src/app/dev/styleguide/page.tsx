import { notFound } from 'next/navigation';
export default function Styleguide() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <main className="page-wrap">
      <section className="main-card">
        <span className="eyebrow">Catalogue de composants</span>
        <h1>Styleguide</h1>
        <section className="section">
          <h2 className="section-title">Boutons</h2>
          <button className="primary-button">Bouton primaire ↗</button>{' '}
          <button className="share-button">Bouton secondaire</button>
        </section>
        <section className="section">
          <h2 className="section-title">Champs</h2>
          <div className="field" style={{ maxWidth: 400 }}>
            <label htmlFor="sample">Adresse e-mail *</label>
            <input id="sample" type="email" placeholder="nom@exemple.cm" />
          </div>
        </section>
        <section className="section">
          <h2 className="section-title">États</h2>
          <span className="badge verified">Vérifiée</span>{' '}
          <span className="badge pending">En attente</span>{' '}
          <span className="badge flagged">Signalée</span>
          <p className="status-message">Succès</p>
          <p className="error-message">Erreur</p>
        </section>
        <section className="section">
          <div className="stats-chip">
            <div>
              <strong>12 480</strong>
              <br />
              <span>Signatures vérifiées</span>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '62%' }} />
          </div>
        </section>
      </section>
    </main>
  );
}
