import { NextRequest, NextResponse } from 'next/server';
import { stripeReconcile } from '@rocket-house-productions/integration/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });

  const reconcileSession = await stripeReconcile(sessionId);

  return NextResponse.json({ ok: reconcileSession.success });
}
