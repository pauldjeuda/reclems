import { requireAdmin } from '@/lib/admin/session';
import { getAdminStats } from '@/lib/petition/stats';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
export const dynamic = 'force-dynamic';
export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const stats = await getAdminStats();
  return (
    <main className="admin-layout">
      <AdminNavigation email={admin.email} />
      <section className="admin-main">
        <span className="eyebrow">Tableau de bord</span>
        <h1 style={{ fontSize: 48, margin: '12px 0 26px' }}>Vue d’ensemble</h1>
        <div className="admin-cards">
          {[
            ['Vérifiées', stats.verified],
            ['En attente', stats.pending],
            ['Signalées', stats.flagged],
            ['Objectif', `${Math.round((stats.verified / Math.max(1, stats.goal)) * 100)} %`]
          ].map(([label, value]) => (
            <article className="admin-card" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
        <section className="section-card" style={{ marginTop: 18 }}>
          <h2 className="section-title">Vérifications par jour</h2>
          <div style={{ display: 'flex', gap: 5, alignItems: 'end', height: 180, marginTop: 18 }}>
            {stats.daily.map((day) => (
              <div
                title={`${day.date}: ${day.count}`}
                key={day.date}
                style={{
                  height: `${Math.max(2, (day.count / (Math.max(1, ...stats.daily.map((x) => x.count)) * 1)) * 100)}%`,
                  background: '#111',
                  opacity: 0.7,
                  flex: 1,
                  borderRadius: '4px 4px 0 0'
                }}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
