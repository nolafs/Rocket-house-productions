'use server';
import { db } from '@rocket-house-productions/integration/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const updateUserRole = async (accountUpdateId: string, userUpdateId: string, role: string) => {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  if ((sessionClaims.metadata as any).role !== 'admin') {
    throw new Error('User not admin');
  }

  try {
    const account = await db.account.update({
      where: {
        id: accountUpdateId,
      },
      data: {
        role: role,
      },
    });
    const client = await clerkClient();

    await client.users.updateUserMetadata(userUpdateId, {
      publicMetadata: {
        role: role,
      },
    });

    revalidatePath('/admin/users');

    return account;
  } catch (error) {
    console.error('[USERS] ERROR', error);
    throw new Error('Failed to update user role');
  }
};
