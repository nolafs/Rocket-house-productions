'use server';
import { db } from '@rocket-house-productions/integration/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function freeCheckout(formData: FormData) {
  const { userId } = await auth();

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

  const client = await clerkClient();
  const clerkUpdate = await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      status: 'active',
      type: 'free',
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
    redirect('/courses/success');
  }
}

export default freeCheckout;
