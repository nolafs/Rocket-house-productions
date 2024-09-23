'use server';
import { db } from '@rocket-house-productions/integration';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const freeCheckout = async (data: FormData) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const account = await db.account.findUnique({
    where: {
      userId,
    },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  await db.account.update({
    where: {
      userId: userId,
    },
    data: {
      status: 'active',
      stripeCustomerId: null,
    },
  });

  const purchase = await db.purchase.create({
    data: {
      accountId: account?.id as string,
      courseId: data.get('courseId') as string,
      childId: (data.get('childId') as string) || null,
      stripeChargeId: null,
      amount: 0,
      type: 'free',
    },
  });

  // check if ok and redirect to success page
  if (purchase) {
    redirect('/courses/success');
  }
};

export default freeCheckout;