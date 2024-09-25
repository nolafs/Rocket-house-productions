'use server';
import { db } from '@rocket-house-productions/integration';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function freeCheckout(formData: FormData) {
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
      courseId: formData.get('courseId') as string,
      childId: (formData.get('childId') as string) || null,
      stripeChargeId: null,
      amount: 0,
      type: 'free',
    },
  });

  // check if ok and redirect to success page
  if (purchase) {
    const clerkUpdate = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        status: 'active',
        type: 'free',
      },
    });

    console.log('clerkUpdate', clerkUpdate);

    if (!clerkUpdate) {
      redirect('/courses/success');
    }
  }
}

export default freeCheckout;
