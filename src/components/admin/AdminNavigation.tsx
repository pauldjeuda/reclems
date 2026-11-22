'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const links = [
  ['/admin', 'Tableau de bord'],
  ['/admin/signatures', 'Signatures'],
  ['/admin/actualites', 'Actualités'],
  ['/admin/remise', 'Remise'],
  ['/admin/parametres', 'Paramètres'],
  ['/admin/journal', 'Journal']
];
export function AdminNavigation({ email }: { email: string }) {
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logout: true })
    });
    router.push('/admin/login');
  }
  return (
    <aside className="admin-side">
      <Link className="wordmark" href="/admin">
        Administration
      </Link>
      <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 22 }}>{email}</p>
      <button className="share-button" onClick={logout}>
        Déconnexion
      </button>
      <nav className="admin-nav">
        {links.map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
