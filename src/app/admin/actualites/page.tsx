'use client';
import { useEffect, useState } from 'react';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
type Campaign = { id: string; subject: string; status: string; sentCount: number };
export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function load() {
    const r = await fetch('/api/admin/campaigns');
    const d = await r.json();
    if (r.ok) setCampaigns(d.campaigns || []);
  }
  useEffect(() => {
    let active = true;
    fetch('/api/admin/campaigns')
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error();
        if (active) setCampaigns(d.campaigns || []);
      })
      .catch(() => {
        if (active) setMessage('Chargement impossible.');
      });
    return () => {
      active = false;
    };
  }, []);
  async function action(payload: Record<string, string>) {
    setBusy(true);
    setMessage('');
    try {
      const r = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMessage('Action terminée.');
      await load();
      return d;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Erreur.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-layout">
      <AdminNavigation email="Session administrateur" />
      <section className="admin-main">
        <span className="eyebrow">Administration</span>
        <h1 style={{ fontSize: 44 }}>Actualités</h1>
        <div className="admin-card">
          <div className="field">
            <label htmlFor="subject">Objet</label>
            <input
              id="subject"
              maxLength={180}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="body">Message</label>
            <textarea
              id="body"
              rows={6}
              maxLength={8000}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="share-row">
            <button
              className="primary-button"
              disabled={busy}
              onClick={async () => {
                const d = await action({ action: 'create', subject, text });
                if (d?.id) {
                  setSubject('');
                  setText('');
                }
              }}
            >
              Enregistrer le brouillon
            </button>
          </div>
          {message && <p role="status">{message}</p>}
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Objet</th>
                <th>Statut</th>
                <th>Envoyés</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td>{c.subject}</td>
                  <td>{c.status}</td>
                  <td>{c.sentCount}</td>
                  <td>
                    <button
                      className="share-button"
                      disabled={busy}
                      onClick={() => action({ action: 'test', id: c.id })}
                    >
                      Test
                    </button>{' '}
                    <button
                      className="share-button"
                      disabled={busy}
                      onClick={() => action({ action: 'start', id: c.id })}
                    >
                      Démarrer
                    </button>{' '}
                    <button
                      className="share-button"
                      disabled={busy}
                      onClick={() => action({ action: 'batch', id: c.id })}
                    >
                      Lot de 50
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
