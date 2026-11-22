'use client';
import { useEffect, useState } from 'react';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
type Row = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  status: string;
  publicHidden: boolean;
};
export default function AdminSignatures() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function load() {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const r = await fetch(`/api/admin/signatures${query}`);
    const d = await r.json();
    if (r.ok) setRows(d.signatures || []);
  }
  useEffect(() => {
    let active = true;
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    fetch(`/api/admin/signatures${query}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error();
        if (active) setRows(d.signatures || []);
      })
      .catch(() => {
        if (active) setError('Chargement impossible.');
      });
    return () => {
      active = false;
    };
  }, [status]);
  async function act(id: string, action: string) {
    setBusy(true);
    try {
      const r = await fetch('/api/admin/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      if (!r.ok) throw new Error();
      await load();
    } catch {
      setError('Action impossible.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-layout">
      <AdminNavigation email="Session administrateur" />
      <section className="admin-main">
        <span className="eyebrow">Administration</span>
        <h1 style={{ fontSize: 44 }}>Signatures</h1>
        <label>
          Statut{' '}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tous</option>
            <option value="verified">Vérifiées</option>
            <option value="pending">En attente</option>
            <option value="flagged">Signalées</option>
          </select>
        </label>
        {error && <p className="error-message">{error}</p>}
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Région</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    {row.firstName} {row.lastName}
                  </td>
                  <td>{row.email}</td>
                  <td>{row.region}</td>
                  <td>
                    <span className={`badge ${row.status}`}>{row.status}</span>
                  </td>
                  <td>
                    <button
                      className="share-button"
                      disabled={busy}
                      onClick={() => act(row.id, 'hide')}
                    >
                      Masquer
                    </button>{' '}
                    <button
                      className="share-button"
                      disabled={busy}
                      onClick={() => act(row.id, 'delete')}
                    >
                      Supprimer
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
