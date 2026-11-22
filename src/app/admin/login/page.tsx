'use client';
import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { clientAuth, firebaseConfigured } from '@/lib/firebase/client';
export default function AdminLogin() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function login() {
    if (!clientAuth) {
      setError(
        'Configurez les clés Firebase Auth dans les variables NEXT_PUBLIC_FIREBASE_* pour activer la connexion.'
      );
      return;
    }
    setBusy(true);
    setError('');
    try {
      const credential = await signInWithPopup(clientAuth, new GoogleAuthProvider());
      const idToken = await credential.user.getIdToken();
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      await response.json();
      if (!response.ok) throw new Error('Connexion non autorisée.');
      router.push('/admin');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion impossible.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="page-wrap">
      <section className="main-card flow-card center">
        <span className="eyebrow">Administration privée</span>
        <h1>Connexion</h1>
        <p>Le tableau de bord est réservé aux comptes explicitement autorisés.</p>
        <button className="primary-button" onClick={login} disabled={busy || !firebaseConfigured}>
          {busy ? 'Connexion…' : 'Continuer avec Google'} ↗
        </button>
        {!firebaseConfigured && (
          <p className="form-lead">Firebase Auth n’est pas configuré dans cet environnement.</p>
        )}
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
