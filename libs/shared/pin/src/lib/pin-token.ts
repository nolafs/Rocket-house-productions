import { SignJWT, jwtVerify } from 'jose';
const secret = new TextEncoder().encode(process.env.PIN_TOKEN_SECRET!);

export async function signPinToken(payload: { scope: 'parents' }, maxAgeSec = 60 * 60 * 12) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + maxAgeSec)
    .sign(secret);
}

export async function verifyPinToken(token: string) {
  const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
  return payload as { scope: 'parents'; iat: number; exp: number };
}
