import { db } from '../firebase/admin';

export async function getPetitionConfig() {
  const snapshot = await db.doc('config/petition').get();
  const data = snapshot.data();
  return {
    isOpen: data?.isOpen !== false,
    goal: typeof data?.goal === 'number' ? data.goal : 10000
  };
}
