import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { isPublicNameAllowed } from '@/lib/security/profanity';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const snap = await db
      .collection('signatures')
      .where('status', '==', 'verified')
      .where('publicDisplay', '==', true)
      .where('publicHidden', '==', false)
      .orderBy('verifiedAt', 'desc')
      .limit(10)
      .get();
    const signatures = snap.docs.flatMap((doc) => {
      const d = doc.data();
      return isPublicNameAllowed(d.firstName)
        ? [{ firstName: d.firstName, city: d.city || '' }]
        : [];
    });
    return NextResponse.json(
      { signatures },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch {
    return NextResponse.json({ signatures: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
