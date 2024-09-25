'use server';
import { db } from '@rocket-house-productions/integration';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import getAccount from './get-account';

export const getChild = async (slug: string) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const account = await getAccount(userId);

  // this will not work if you have more than one child or purchases (need path in child id) in future

  const purchase = await db.purchase.findFirst({
    where: {
      accountId: account?.id,
      course: {
        slug: slug,
      },
    },
  });

  if (!purchase) {
    return redirect(`/courses/error?status=error&message=No%20purchase%20found`);
  }

  if (!purchase.childId) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  const child = await db.child.findFirst({
    where: {
      id: purchase?.childId,
    },
  });

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  return {
    ...child,
    purchaseId: purchase?.id,
    purchaseType: purchase?.type,
  };
};
