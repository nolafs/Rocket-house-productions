import { cookies } from 'next/headers';
import { verifyPinToken } from './pin-token';

export async function requireParentCapability(scope: 'parents' = 'parents') {
  const cookieStore = await cookies(); // ✅ Next 15
  const token = cookieStore.get(`pin:${scope}`)?.value;
  if (!token) throw new Error('PARENT_CAPABILITY_MISSING');
  await verifyPinToken(token); // throws if invalid/expired
}
