import { FieldValue } from 'firebase-admin/firestore';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { requireAdmin } from '@/lib/admin/session';
import { getAdminStats } from '@/lib/petition/stats';
import { db } from '@/lib/firebase/admin';
import { PrintButton } from '@/components/admin/PrintButton';
export const dynamic = 'force-dynamic';
export default async function HandoverPage() {
  const admin = await requireAdmin();
  await db.collection('auditLogs').add({
    action: 'export_aggregate',
    adminEmail: admin.email,
    at: FieldValue.serverTimestamp(),
    meta: { view: 'handover-report' }
  });
  const stats = await getAdminStats();
  return (
    <main className="admin-layout">
      <AdminNavigation email={admin.email} />
      <section className="admin-main">
        <div className="no-print">
          <span className="eyebrow">Dossier de remise</span>
          <h1 style={{ fontSize: 42 }}>Bilan agrégé</h1>
          <PrintButton />
        </div>
        <p className="print-only">Initiative citoyenne — bilan agrégé de la pétition</p>
        <p>
          Date :{' '}
          {new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'long',
            timeZone: 'Africa/Douala'
          }).format(new Date())}
        </p>
        <div className="admin-card">
          <strong>{new Intl.NumberFormat('fr-FR').format(stats.verified)}</strong>
          <span>Signatures vérifiées</span>
        </div>
        <h2>Répartition par région</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Région</th>
              <th>Signatures</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.byRegion).map(([region, count]) => (
              <tr key={region}>
                <td>{region}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Répartition par jour (30 jours)</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Jour (Africa/Douala)</th>
              <th>Signatures vérifiées</th>
            </tr>
          </thead>
          <tbody>
            {stats.daily.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Méthodologie</h2>
        <p>
          Une signature est comptée après confirmation de l’adresse e-mail. Une adresse e-mail
          normalisée ne peut correspondre qu’à une signature. Les doublons sont dédupliqués par
          identifiant HMAC. Les signatures signalées sont exclues de ce total tant qu’elles ne sont
          pas validées. Aucune donnée personnelle n’est transmise avec ce dossier.
        </p>
      </section>
    </main>
  );
}
