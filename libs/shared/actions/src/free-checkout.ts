'use server';
import { db } from '@rocket-house-productions/integration/server';
import { auth } from '@clerk/nextjs/server';
import { SessionFlags } from './session';
import { logger } from '@rocket-house-productions/util';

export async function freeCheckout(formData: FormData): Promise<{ success: boolean }> {
  const { userId } = await auth();

  logger.info('[FREE CHECKOUT]');

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

  logger.info('[FREE CHECKOUT] PURCHASE');

  const data = await SessionFlags();

  if (!data) {
    throw new Error('Session data not found');
  }

  return { success: true };
}
