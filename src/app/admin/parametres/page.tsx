'use client';
import { useEffect, useState } from 'react';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
export default function AdminSettings() {
  const [open, setOpen] = useState(true);
  const [goal, setGoal] = useState(10000);
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch('/api/admin/config')
      .then((r) => r.json())
      .then((data) => {
        setOpen(data.isOpen);
        setGoal(data.goal);
      })
      .catch(() => setMessage('Chargement impossible.'));
  }, []);
  async function save() {
    const r = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOpen: open, goal })
    });
    setMessage(r.ok ? 'Paramètres enregistrés.' : 'Enregistrement impossible.');
  }
  return (
    <main className="admin-layout">
      <AdminNavigation email="Session administrateur" />
      <section className="admin-main">
        <h1>Paramètres</h1>
        <div className="admin-card">
          <label className="check-row">
            <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />{' '}
            Pétition ouverte
          </label>
          <div className="field" style={{ maxWidth: 300, marginTop: 16 }}>
            <label htmlFor="goal">Objectif</label>
            <input
              id="goal"
              type="number"
              min="1"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
            />
          </div>
          <button className="primary-button" style={{ marginTop: 18 }} onClick={save}>
            Enregistrer
          </button>
          {message && <p role="status">{message}</p>}
        </div>
      </section>
    </main>
  );
}
