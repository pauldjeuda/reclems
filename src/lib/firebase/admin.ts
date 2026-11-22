import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { env } from '../env';

function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;
  const projectId = env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'petition-local';
  const emulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
  if (emulator || !env.FIREBASE_PRIVATE_KEY || !env.FIREBASE_CLIENT_EMAIL)
    return initializeApp({ projectId });
  return initializeApp({
    projectId,
    credential: cert({
      projectId,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

export const adminApp = getAdminApp();
export const db = getFirestore(adminApp);
