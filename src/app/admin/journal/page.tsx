'use client';
import { useEffect, useState } from 'react';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
type Event = { action: string; adminEmail: string; at: string; meta: Record<string, unknown> };
export default function AuditPage() {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    fetch('/api/admin/audit')
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => undefined);
  }, []);
  return (
    <main className="admin-layout">
      <AdminNavigation email="Session administrateur" />
      <section className="admin-main">
        <span className="eyebrow">Administration</span>
        <h1 style={{ fontSize: 44 }}>Journal d’audit</h1>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Administrateur</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={`${event.at}-${index}`}>
                  <td>{new Date(event.at).toLocaleString('fr-FR')}</td>
                  <td>{event.action}</td>
                  <td>{event.adminEmail}</td>
                  <td>{JSON.stringify(event.meta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
