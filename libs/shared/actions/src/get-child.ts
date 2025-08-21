'use server';
import { db } from '@rocket-house-productions/integration/server';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import getAccount from './get-account';

export const getChild = async (slug: string) => {
  const { userId, sessionClaims } = await auth();

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

  // is user admin

  console.log('[getChild] sessionClaims', sessionClaims);

  const isAdmin = (sessionClaims?.metadata as { role: string })?.role === 'admin';
  let child = null;

  if (!isAdmin) {
    if (!purchase) {
      return redirect(`/courses/error?status=error&message=No%20purchase%20found`);
    }

    if (!purchase.childId) {
      return redirect(`/courses/error?status=error&message=No%20child%20found`);
    }

    child = await db.child.findFirst({
      where: {
        id: purchase?.childId,
      },
    });

    if (!child) {
      return redirect(`/courses/error?status=error&message=No%20child%20found`);
    }
  } else {
    if (!purchase) {
      //first child for admin
      child = await db.child.findFirst({
        where: {
          accountId: account?.id,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } else {
      if (!purchase.childId) {
        return redirect(`/courses/error?status=error&message=No%20child%20found`);
      }

      child = await db.child.findFirst({
        where: {
          id: purchase?.childId,
        },
      });
    }
  }

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  return {
    ...child,
    purchaseId: purchase?.id,
    purchaseType: purchase?.type,
    purchaseCategory: purchase?.category,
  };
};
