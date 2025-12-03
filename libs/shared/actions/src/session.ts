'use server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { userAccountData } from '@rocket-house-productions/util';
import { userSession } from '@/types/userSesssion';
import { setSessionCookies } from './setSessionCookies';

export async function SessionFlags(): Promise<Partial<userSession> | null> {
  const { userId, sessionId } = await auth();

  if (!userId || !sessionId) {
    return null;
  }

  const flags = await userAccountData(userId);
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

  await setSessionCookies(flags);

  return { ...user.publicMetadata, ...flags };
}
