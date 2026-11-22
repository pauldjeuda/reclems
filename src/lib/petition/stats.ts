import { Timestamp } from 'firebase-admin/firestore';
import { unstable_cache } from 'next/cache';
import { db } from '../firebase/admin';
import { REGIONS } from '../constants';
import { getPetitionConfig } from './config';

const getCachedPublicCore = unstable_cache(
  async () => {
    const [config, totalSnap] = await Promise.all([
      getPetitionConfig(),
      db.collection('signatures').where('status', '==', 'verified').count().get()
    ]);
    return { total: totalSnap.data().count, goal: config.goal, isOpen: config.isOpen };
  },
  ['public-stats-core-v1'],
  { revalidate: 60 }
);
const getCachedRegions = unstable_cache(
  async () => {
    const snapshots = await Promise.all(
      REGIONS.map((region) =>
        db
          .collection('signatures')
          .where('status', '==', 'verified')
          .where('region', '==', region)
          .count()
          .get()
      )
    );
    return Object.fromEntries(
      REGIONS.map((region, index) => [region, snapshots[index].data().count])
    );
  },
  ['public-stats-region-v1'],
  { revalidate: 300 }
);
export async function getPublicStats() {
  const [core, byRegion] = await Promise.all([getCachedPublicCore(), getCachedRegions()]);
  return { ...core, byRegion };
}

const getCachedAdminStats = unstable_cache(
  async () => {
    const [config, ...counts] = await Promise.all([
      getPetitionConfig(),
      ...['verified', 'pending', 'flagged'].map((status) =>
        db.collection('signatures').where('status', '==', status).count().get()
      ),
      ...REGIONS.map((region) =>
        db
          .collection('signatures')
          .where('status', '==', 'verified')
          .where('region', '==', region)
          .count()
          .get()
      ),
      ...['whatsapp', 'facebook', 'x', 'tiktok', 'direct', 'other'].map((src) =>
        db
          .collection('signatures')
          .where('status', '==', 'verified')
          .where('src', '==', src)
          .count()
          .get()
      )
    ]);
    const dayParts = (date: Date) => {
      const p = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Douala',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(date);
      const get = (type: string) => p.find((part) => part.type === type)?.value || '00';
      return `${get('year')}-${get('month')}-${get('day')}`;
    };
    const daily = await Promise.all(
      Array.from({ length: 30 }, (_, offset) => {
        const day = new Date();
        day.setUTCDate(day.getUTCDate() - offset);
        const date = dayParts(day);
        const [year, month, dayOfMonth] = date.split('-').map(Number);
        const dayStart = new Date(Date.UTC(year, month - 1, dayOfMonth) - 60 * 60_000);
        return db
          .collection('signatures')
          .where('status', '==', 'verified')
          .where('verifiedAt', '>=', Timestamp.fromDate(dayStart))
          .where('verifiedAt', '<', Timestamp.fromDate(new Date(dayStart.getTime() + 86400_000)))
          .count()
          .get()
          .then((s) => ({ date, count: s.data().count }));
      })
    );
    const latest = await db.collection('signatures').orderBy('createdAt', 'desc').limit(10).get();
    return {
      goal: config.goal,
      verified: counts[0].data().count,
      pending: counts[1].data().count,
      flagged: counts[2].data().count,
      daily: daily.reverse(),
      byRegion: Object.fromEntries(
        REGIONS.map((region, index) => [region, counts[index + 3].data().count])
      ),
      bySource: Object.fromEntries(
        ['whatsapp', 'facebook', 'x', 'tiktok', 'direct', 'other'].map((src, index) => [
          src,
          counts[index + 3 + REGIONS.length].data().count
        ])
      ),
      latest: latest.docs.map((doc) => {
        const d = doc.data();
        return {
          firstName: d.firstName,
          city: d.city || '',
          region: d.region,
          status: d.status,
          createdAt: d.createdAt?.toDate().toISOString()
        };
      })
    };
  },
  ['admin-stats-v1'],
  { revalidate: 300 }
);

export async function getAdminStats() {
  return getCachedAdminStats();
}
