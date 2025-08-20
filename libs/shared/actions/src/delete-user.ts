'use server';
import { db } from '@rocket-house-productions/integration/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const deleteUser = async (accountDeleteId: string, userDeleteId: string) => {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  if ((sessionClaims.metadata as any).role !== 'admin') {
    throw new Error('User not admin');
  }

  try {
    const account = await db.account.delete({
      where: {
        id: accountDeleteId,
      },
    });
    const client = await clerkClient();

    await client.users.deleteUser(userDeleteId);

    revalidatePath('/admin/users');
  } catch (error) {
    console.error('[USERS]', error);
    throw new Error('Failed to delete user');
  }
};
