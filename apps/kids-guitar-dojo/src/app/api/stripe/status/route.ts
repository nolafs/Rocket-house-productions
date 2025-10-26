import { NextRequest, NextResponse } from 'next/server';
import { stripeCheckoutSessionStatus } from '@rocket-house-productions/integration/server';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });

  const status = await stripeCheckoutSessionStatus(sessionId);

  return NextResponse.json(status);
}
