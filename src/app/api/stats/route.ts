import { NextResponse } from 'next/server';
import { getPublicStats } from '@/lib/petition/stats';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    return NextResponse.json(await getPublicStats(), {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    });
  } catch {
    return NextResponse.json(
      { total: 0, goal: 10000, isOpen: true, byRegion: {} },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
