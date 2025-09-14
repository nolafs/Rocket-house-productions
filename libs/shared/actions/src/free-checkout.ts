'use server';
import { db } from '@rocket-house-productions/integration/server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SessionFlags } from './session';
import { setSessionCookies } from './setSessionCookies';
import { revalidatePath } from 'next/cache';

export async function freeCheckout(formData: FormData) {
  const { userId } = await auth();

  console.log('[FREE CHECKOUT]');

  if (!userId) {
    throw new Error('Unauthorized');
  }

  await db.$transaction(async tx => {
    const account = await tx.account.findUnique({
      where: {
        userId,
      },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    await tx.account.update({
      where: {
        userId: userId,
      },
      data: {
        status: 'active',
        stripeCustomerId: null,
      },
    });

    await tx.purchase.create({
      data: {
        accountId: account?.id as string,
        courseId: formData.get('courseId') as string,
        childId: (formData.get('childId') as string) || null,
        stripeChargeId: null,
        amount: 0,
        type: 'free',
      },
    });
  });

  console.log('[FREE CHECKOUT] PURCHASE');

  const data = await SessionFlags();

  if (!data) {
    throw new Error('Session data not found');
  }

  return { success: true };
}
