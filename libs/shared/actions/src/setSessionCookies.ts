'use server';

import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { userSession } from '@/types/userSesssion';

const secret = new TextEncoder().encode(process.env.SESSION_FLAGS_SECRET!);

export async function setSessionCookies(flags: Partial<userSession>) {
  const token = await new SignJWT(flags)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(secret);

  const jar = await cookies(); // Next 15
  jar.set({
    name: 'sf',
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 30,
  });
}
