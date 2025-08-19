'use server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { computeFlagsFromUserDb } from '@rocket-house-productions/util';

const secret = new TextEncoder().encode(process.env.SESSION_FLAGS_SECRET);

export async function SessionFlags() {
  const { userId, sessionId } = await auth();

  if (!userId || !sessionId) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const flags = await computeFlagsFromUserDb(userId);
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  await (
    await clerkClient()
  ).users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      ...flags,
    },
  });

  const token = await new SignJWT(flags as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(secret);

  const res = NextResponse.json({ ok: true, flags });
  res.cookies.set('sf', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 30,
  });

  return { ...user.publicMetadata, ...flags };
}
