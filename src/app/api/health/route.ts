import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
export const runtime = 'nodejs';
export async function GET() {
  try {
    await db.doc('config/petition').get();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
