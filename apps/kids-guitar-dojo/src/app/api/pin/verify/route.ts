// app/api/(.)pin/verify/route.ts
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import argon2 from 'argon2';
import { signPinToken } from '@rocket-house-productions/pin/server';
import { db } from '@rocket-house-productions/integration/server';

const DEFAULT_SCOPE = 'parents';

// (optional) very small DB-backed rate limiter
async function rateLimit(ip: string, scope: string) {
  const key = `pin_rl:${ip}:${scope}`;
  const now = new Date();
  const windowSec = 60 * 5;
  const reset = new Date(now.getTime() + windowSec * 1000);
  const max = 10;

  const row = await db.kvTemp.findUnique({ where: { key } }).catch(() => null);
  let value = { count: 0, reset: reset.toISOString() };
  if (row) {
    const v = JSON.parse(row.value);
    value = new Date(v.reset) > now ? v : { count: 0, reset: reset.toISOString() };
  }
  value.count += 1;
  await db.kvTemp.upsert({
    where: { key },
    update: { value: JSON.stringify(value), expiresAt: new Date(value.reset) },
    create: { key, value: JSON.stringify(value), expiresAt: new Date(value.reset) },
  });
  return { exceeded: value.count > max, reset: value.reset };
}

export async function POST(req: Request) {
  const { pin, scope = DEFAULT_SCOPE } = await req.json();
  if (!pin || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }

  // ✅ Next 15 headers()
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = await rateLimit(ip, scope);
  if (rl.exceeded) return NextResponse.json({ error: 'Too many attempts. Try later.' }, { status: 429 });

  const row = await db.parentPin.findUnique({ where: { scope } });
  if (!row || !row.active || (row.expiresAt && row.expiresAt < new Date())) {
    return NextResponse.json({ error: 'PIN unavailable' }, { status: 404 });
  }

  const ok = await argon2.verify(row.hash, pin);
  if (!ok) return NextResponse.json({ ok: false }, { status: 200 });

  const jwt = await signPinToken({ scope: 'parents' }, 60 * 60 * 12); // 12h

  // ✅ Next 15 cookies() — write in a Route Handler
  (await cookies()).set(`pin:parents`, jwt, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}
