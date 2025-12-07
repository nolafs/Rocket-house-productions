'use server';

import { db } from '@rocket-house-productions/integration/server';
import { AccountWithPurchases, AccountData, AccountStatus, NoAccountData } from '@rocket-house-productions/types';

export async function getAccount(userId: string): Promise<AccountWithPurchases | null> {
  return db.account.findFirst({
    where: {
      userId: userId,
    },
    include: {
      _count: {
        select: {
          purchases: true,
        },
      },
      purchases: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              isPublished: true,
            },
          },
        },
      },
      children: true,
    },
  });
}

export async function getAccountData(userId: string): Promise<Partial<AccountData> | NoAccountData> {
  try {
    const account = await db.account.findFirst({
      where: { userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        purchases: {
          select: { id: true, childId: true, type: true, category: true, course: { select: { slug: true, id: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Get app settings to determine membership course
    const appSettings = await db.appSettings.findFirst({
      include: {
        membershipSettings: {
          include: {
            course: {
              select: {
                id: true,
                order: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!account) {
      return { status: 'inactive', hasPurchases: false };
    }

    const purchases = account.purchases ?? null;
    const hasPurchases = purchases.length > 0;

    //check if user has membership purchase, if so, consider as unenrolled
    const hasMembershipPurchase = purchases.filter(p => {
      return appSettings?.membershipSettings?.course.id === p.course.id;
    });

    const unenrolled = purchases.filter(p => !p.childId);
    const singleEnrolled = purchases.length === 1 && purchases[0]?.childId ? purchases[0] : null;

    return {
      id: account.id,
      firstName: account?.firstName ?? undefined,
      lastName: account?.lastName ?? undefined,
      email: account.email ?? undefined,
      status: (account.status as AccountStatus) ?? 'inactive',
      hasPurchases,
      purchases: purchases,
      tier: hasMembershipPurchase[0]?.category || hasMembershipPurchase[0]?.type || undefined,
      type: hasMembershipPurchase[0]?.type || 'free',
      hasMembership: hasMembershipPurchase.length > 0 && hasMembershipPurchase[0]?.type !== 'free',
      singleEnrolledCourseType: singleEnrolled?.type || undefined,
      singleEnrolledCourseSlug: singleEnrolled?.course.slug || undefined,
      unenrolledPurchaseId: unenrolled.length === 1 ? purchases[0].id : undefined,
    };
  } catch (error) {
    console.error('Error computing session flags:', error);
    return { status: 'inactive', hasPurchases: false };
  }
}
