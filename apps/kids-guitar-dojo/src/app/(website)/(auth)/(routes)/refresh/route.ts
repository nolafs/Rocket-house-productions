// app/auth/refresh/route.ts
import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { SignJWT } from 'jose';
import { getAccountData } from '@rocket-house-productions/actions/server';
import { logger } from '@rocket-house-productions/util';

const secret = new TextEncoder().encode(process.env.SESSION_FLAGS_SECRET!);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const { userId } = await auth();

  const isProduction = String(process.env.PRODUCTION).toLowerCase() === 'true';

  // sanitize "next" to avoid open redirects
  const next = url.searchParams.get('next') || '/courses';
  const nextSafe = next.startsWith('/') ? next : '/courses';

  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', url));
  }

  // 1) Compute flags
  const flags = await getAccountData(userId);

  // 2) (Optional) persist to Clerk for later reads
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

  logger.debug('[REFRESH]', { publicMetadata: user.publicMetadata, flags });

  // 3) Sign the flags into a short-lived cookie for middleware
  const token = await new SignJWT(flags as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(secret);

  const res = NextResponse.redirect(new URL(nextSafe, url));
  res.cookies.set('sf', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction, // false on localhost
    path: '/',
    maxAge: 60 * 30,
  });

  return res;
}
